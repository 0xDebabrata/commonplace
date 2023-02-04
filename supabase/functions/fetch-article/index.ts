import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/v102/@supabase/supabase-js@2.4.0/es2022/supabase-js.js'
import { Readability } from "https://esm.sh/v103/@mozilla/readability@0.4.2/es2022/readability.js";
import { DOMParser, initParser } from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

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

  await initParser()
  const doc = new DOMParser().parseFromString(html, "text/html")
  const article = new Readability(doc).parse()

  // Return entire text content if it doesn't exceed token count limitation
  if (article.length <= 12000) {
    return { article, chunks: article.length ? [article.textContent] : []}
  }
  
  let text = ""
  const sentences: string[] = article.textContent.split(".")
  const chunks: string[] = []
  sentences.forEach((s) => {
    if (text.length + s.length <= 5000) {
      text += s
    } else {
      chunks.push(text)
      text = s 
    }
  })
  if (text.length) chunks.push(text)

  return { article, chunks }
}

const getChunkSummaries = async (title: string, chunks: string[]): Promise<string[]> => {
  const prompts = chunks.map(chunk => {
    return `Give a somewhat detailed summary of the following part of an article in less than 80 words.\n\n${title}\n${chunk}`
  })
  let requestBody = JSON.stringify({
    prompt: prompts,
    model,
    max_tokens: 150,
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
  const prompt = `Summarize the text below in 200 to 240 words in a somewhat detailed manner, not repeating the title and provide 3 short key actionable points\n\n${aggregateSummary}`
  const requestBody = JSON.stringify({
    prompt,
    model,
    max_tokens: 400,
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

const getAuthorNameFromUrl = async (host: string): Promise<string> => {
  const prompt = `Extract the name from this url: ${host}`
  const requestBody = JSON.stringify({
    prompt,
    model: "text-babbage-001",
    max_tokens: 20,
    temperature: 0,
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
  console.log("Predicted name from article: ", data.choices[0].text.trim())

  return data.choices[0].text.trim()
}

const insertArticle = async (user_id: string, supabase, article, articleUrl: string, summary: string | null) => {
  const url = new URL(articleUrl)
  if (!article.byline) {
    const name = await getAuthorNameFromUrl(url.host)
    article.byline = name
  }

  const { data: cardId, error } = await supabase.rpc("save_article", {
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    lang: article.lang,
    text_content: article.textContent,
    site_name: article.siteName ? article.siteName : article.byline,
    url: articleUrl,
    length: article.length,
    url_host: url.host,
    summary: summary,
    user_id,
    author_name: article.byline,
  })

  if (error) throw error;

  return cardId
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

  // Fetch article content and save
  if (type === 'fetch') {
    const { article } = await getArticleContent(articleUrl)
    if (!article.length) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 469,
      })
    }

    let cardId;
    try {
      cardId = await insertArticle(user.id, supabaseClient, article, articleUrl, "")
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify(error), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ ...article, cardId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } else if (type === 'summarize') {

    // Fetch article contents and chunks
    const { article, chunks } = await getArticleContent(articleUrl)
    if (!chunks.length) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 469,
      })
    }

    if (chunks.length === 1) {
      console.log("Within token count")
      const articleSummary = await getArticleSummary(chunks[0])

      return new Response(JSON.stringify({ data: articleSummary, article }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Get summaries of each chunk
    console.log("Chunked summaries")
    const summaries = await getChunkSummaries(article.title, chunks)
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
