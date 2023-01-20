import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"
import { createClient } from 'https://esm.sh/v102/@supabase/supabase-js@2.4.0/es2022/supabase-js.js'

const apiKey = Deno.env.get("OPENAI_KEY");
const model = "text-davinci-003";
const temperature = 0.5;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const getArticleContent = async (articleUrl: string) => {
  const res = await fetch(articleUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title: string = $("head > title").text() || articleUrl;
  const paragraphs: string[]  = $("article").find("p").toArray().map((e, i) => $(e).text())

  const totalSize = paragraphs.join("\n").length

  // Return entire text content if it doesn't exceed token count limitation
  if (totalSize <= 12000) {
    return { title, chunks: [paragraphs.join("\n")]}
  }
  
  let text = ""
  const combinedIntoChunks: string[] = []
  paragraphs.forEach((p) => {
    if (text.length + p.length <= 5000) {
      text += p
    } else {
      combinedIntoChunks.push(text)
      text = p 
    }
  })
  if (text.length) combinedIntoChunks.push(text)

  return { title, chunks: combinedIntoChunks }
}

const getChunkSummaries = async (title: string, chunks: string[]): Promise<string[]> => {
  const prompts = chunks.map(chunk => {
    return `Give a somewhat detailed summary of the following part of an article in less than 80 words.\n\n${title}\n${chunk}`
  })
  let requestBody = JSON.stringify({
    prompt: prompts,
    model,
    max_tokens: 120,
    temperature,
  });
  const apiUrl = "https://api.openai.com/v1/completions";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: requestBody,
  };
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  console.log(data)

  return data.choices.map(choice => choice.text)
}

const getArticleSummary = async (aggregateSummary: string): Promise<string> => {
  const prompt = `Summarize the text below in about 300 words, not repeating the title and provide 3 key actionable points\n\n${aggregateSummary}`
  const requestBody = JSON.stringify({
    prompt,
    model,
    max_tokens: 450,
    temperature,
  });
  const apiUrl = "https://api.openai.com/v1/completions";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: requestBody,
  };
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  console.log(data)

  return data.choices[0]
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { type, articleUrl } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: req.headers.get('Authorization')! }}}
  )

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Ensure user is authorized
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authorized." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  if (!articleUrl) {
    return new Response(JSON.stringify({ error: "Please provide an article URL" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  // TODO
  // Fetch article content and save
  if (type === 'fetch') {
    const article = await getArticleContent(articleUrl)
    if (!article.content) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 469,
      })
    }

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } else if (type === 'summarize') {         // Return article summarization
    const article = await getArticleContent(articleUrl)
    if (!article.chunks.length) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 469,
      })
    }

    if (article.chunks.length === 1) {
      console.log("Within token count")
      const articleSummary = await getArticleSummary(article.chunks[0])

      return new Response(JSON.stringify({ data: articleSummary, article }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Get summaries of each chunk
    console.log("Chunked summaries")
    const summaries = await getChunkSummaries(article.title, article.chunks)
    const aggregate = summaries.join("\n")

    const articleSummary = await getArticleSummary(aggregate)

    return new Response(JSON.stringify({ data: articleSummary, article }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  return new Response(
    JSON.stringify({ message: "Invalid request" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 },
  )
})
