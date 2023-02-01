import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Configuration, OpenAIApi } from "openai"

// OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)
const model = "text-embedding-ada-002"

const createEmbeddings = async (entities) => {
  const input = []
  entities.forEach((e, i) => {
    input.push(e.name)
  })

  const resp = await openai.createEmbedding({
    model,
    input,
    user: "commonplace"
  })
  console.log("\nEmbeddings created\n")

  return { data: resp.data }
}

const insertSmartCollections = async (openAiData, entities) => {
  const vectors = []
  openAiData.forEach((data, i) => {
    vectors.push({
      id: entities[i].id.toString(),
      values: data.embedding,
      metadata: { user_id: "commonplace", type: "entities" }
    })
  })

  try {
    const resp = await fetch(`${process.env.PINECONE_URL}/vectors/upsert`, {
      method: "POST",
      headers: {
        "Api-Key": `${process.env.PINECONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vectors, namespace: "entities" })
    })

    if (resp.headers.get("Content-Type") === "text/plain") {
      return { data: await resp.text() }
    }
    return { data: await resp.json() }
  } catch (error) {
    throw error
  }
}

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({req, res})

  const { data: entities } = await supabase.from("entities").select("id, name").range(701, 900)
  console.log("data fetched")
  const { data: openAiData } = await createEmbeddings(entities)
  const { data: pinecone } = await insertSmartCollections(openAiData.data, entities)

  return res.status(200).json(pinecone)
}
