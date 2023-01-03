import { Configuration, OpenAIApi } from "openai"

// OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)
const model = "text-embedding-ada-002"

export const createEmbeddings = async (dataArray, cardIds, user_id) => {
  const cardIdsWithEmbedding = []
  const input = []
  dataArray.forEach((text, i) => {
    if (text) {
      input.push(text)
      cardIdsWithEmbedding.push(cardIds[i])
    }
  })

  const resp = await openai.createEmbedding({
    model,
    input,
    user: user_id
  })
  console.log("\nEmbeddings created\n")

  return { data: resp.data, cardIdsWithEmbedding }
}
