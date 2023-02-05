import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/v102/@supabase/supabase-js@2.4.0/es2022/supabase-js.js'

const apiKey = Deno.env.get("OPENAI_KEY");
const model = "text-embedding-ada-002";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const generateEmbeddings = async (chunks: string[], user_id: string) => {
  const apiUrl = "https://api.openai.com/v1/embeddings";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: chunks,
      user: user_id
    }),
  };
  const response = await fetch(apiUrl, options);
  const { data: embeddings } = await response.json();
  console.log(chunks.length, "embeddings generated")
  return embeddings
}

const insertVectors = async (chunks: string[], openAiData, namespace: string, cardId: number, user_id: string) => {
  const vectors: any = []
  openAiData.forEach((data, idx) => {
    vectors.push({
      id: `${cardId}/${idx}`,
      values: data.embedding,
      metadata: { user_id, type: "article", card_id: cardId }
    })
  })

  try {
    const resp = await fetch(`${Deno.env.get('PINECONE_URL')}/vectors/upsert`, {
      method: "POST",
      headers: {
        "Api-Key": `${Deno.env.get('PINECONE_API_KEY')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vectors, namespace })
    })

    console.log("Vectors inserted")
    if (resp.headers.get("Content-Type") === "text/plain") {
      return { data: await resp.text() }
    }
    return { data: await resp.json() }
  } catch (error) {
    throw error
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  const { cardId, textContent } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: req.headers.get('Authorization')! }}}
  )

  // Ensure user is authorized
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authorized." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  if (!textContent) {
    console.log("No text provided")
    return new Response(JSON.stringify({ error: "No text provided" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  // Chunk text into 375 words
  const sentences: string[] = textContent.split(".")
  let words: string[] = []
  const chunks: string[] = []
  sentences.forEach((s) => {
    const w = s.split(" ")
    if (words.length + w.length <= 375) {
      words = [...words, ...w]
    } else {
      chunks.push(words.join(" "))
      words = w
    }
  })
  if (words.length) chunks.push(words.join(" "))

  // Push chunks to supabase
  const { error } = await supabaseClient
    .from("chunks")
    .insert(chunks.map((chunk, idx) => ({
      id: idx,
      card_id: cardId,
      text: chunk,
      user_id: user.id
    })))

  if (error) {
    console.log(error)
    return new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 501,
    })
  }

  try {
    // Generate vectors for each chunk
    const embeddings = await generateEmbeddings(chunks, user.id)

    // Upsert vectors to pinecone (chunks namespace)
    const resp = await insertVectors(chunks, embeddings, "chunks", cardId, user.id)

  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify(error), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 501,
    })
  }

  return new Response(JSON.stringify({ success: "Ok" }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
})
