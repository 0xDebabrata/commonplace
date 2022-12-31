import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { createEmbeddings } from "../../functions/openai"
import { queryVectors } from "../../functions/pinecone"

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated." })
  }

  const { phrase } = req.query;

  if (!phrase.trim()) {
    return res.status(404).json({ error: "Invalid query" })
  }

  // Create embeddings for the query
  const { data } = await createEmbeddings([phrase.trim()], session.user.id)
  // Query vectors on Pinecone
  const { data: results } = await queryVectors(data.data[0].embedding, "cards", session.user.id)
  console.log(results.matches)

  // Get cards from Supabase
  const cardIds = []
  results.matches.forEach(cardVector => {
    if (cardVector.score > 0.745) {
      cardIds.push(parseInt(cardVector.id))
    }
  })
  const { data: cards } = await supabase.rpc("get_cards_from_ids", {
    card_ids: cardIds
  })

  return res.status(200).json({ data: cards })
}

