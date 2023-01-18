import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"
import { createClient } from 'https://esm.sh/v102/@supabase/supabase-js@2.4.0/es2022/supabase-js.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const getArticleContent = async (articleUrl: string) => {
  const res = await fetch(articleUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title: string = $("head > title").text() || articleUrl;
  const article = $("article").text();
  let content: string;

  if (!article) {
    content = $("p").text();
  } else {
    content = $("article p").text();
  }

  return { title, content }
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
    const article = await getArticleContent(articleUrl)
    if (!article.content) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } else if (type === 'summarize') {         // Return article summarization
    const article = await getArticleContent(articleUrl)
    if (!article.content) {
      return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const prompt = `Give a somewhat detailed summary of the following article as a helpful personal assistant
    in no more than 400 words and also provide a list of maximum 5 key points\n\n${article.title}\n${article.content}`

    const apiKey = Deno.env.get("OPENAI_KEY");
    const model = "text-davinci-003";
    const maxTokens = 300;
    const temperature = 0.6;

    const requestBody = JSON.stringify({
        prompt,
        model,
        max_tokens: maxTokens,
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
    return new Response(JSON.stringify({ data: data.choices[0].text, article }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  return new Response(
    JSON.stringify({ message: "Invalid request" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})
