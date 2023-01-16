import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const getArticleContent = async (articleUrl: string) => {
  const res = await fetch(articleUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title: string = $("title").text() || articleUrl;
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
  const url = new URL(req.url)
  const articleUrl = url.searchParams.get("url")
  const path = url.pathname

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: req.headers.get('Authorization')! }}}
  )

  // Ensure user is authorized
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authorized." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!articleUrl) {
    return new Response(JSON.stringify({ error: "Please provide an article URL" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  const article = await getArticleContent(articleUrl)
  if (!article.content) {
    return new Response(JSON.stringify({ error: "Couldn't fetch article" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  // Fetch article content and save
  if (path === '/path') {
    return new Response(JSON.stringify(article), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } else if (path === '/summarize') {         // Return article summarization

  }

  return new Response(
    JSON.stringify({ message: "Invalid request" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
