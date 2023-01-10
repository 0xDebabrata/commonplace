import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { getSimilarVectors } from "../../functions/pinecone"

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated." })
  }

  const { cardId } = req.query

  const { data: results } = await getSimilarVectors(cardId, "cards", session.user.id)

  // Get cards from Supabase
  const cardIds = []
  results.matches.forEach((cardVector, idx) => {
    if (idx !== 0) {                    // Ignore first card since it'll be equal to input
      if (cardVector.score > 0.745) {
        cardIds.push(parseInt(cardVector.id))
      }
    } 
  })
  const { data: cards } = await supabase.rpc("get_cards_from_ids", {
    card_ids: cardIds
  })

  return res.status(200).json({ data: cards })
}
