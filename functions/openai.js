import { Configuration, OpenAIApi } from "openai"

// OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)
const model = "text-embedding-ada-002"

export const createEmbeddings = async (dataArray, user_id) => {
  const resp = await openai.createEmbedding({
    model,
    input: dataArray,
    user: user_id
  })
  console.log("\nEmbeddings created\n")

  return { data: resp.data }
}
