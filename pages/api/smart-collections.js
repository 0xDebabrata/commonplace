import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createEmbeddings } from "../../functions/openai"
import { queryVectors } from "../../functions/pinecone";

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })

  const { data: { session }} = await supabase.auth.getSession()
  if (!session) {
    return res.status(401).json({ error: "Not authorized." })
  }

  const { cardId, text } = JSON.parse(req.body);

  if (!text.trim()) {
    return res.status(404).json({ error: "Invalid query" })
  }

  // Create embeddings for the query
  const { data } = await createEmbeddings([text.trim()], session.user.id)
  // Query vectors on Pinecone
  const { data: results } = await queryVectors(data.data[0].embedding, "entities", "commonplace")

  let ids = results.matches.filter((res) => res.score > 0.8)
  if (!ids.length) {
    ids = results.matches.slice(0, 3)
  }
  ids = ids.map((res) => res.id)
  
  // Fetch entity_id, name and description from supabase
  const { data: entities } = await supabase.rpc("get_entities_from_ids", { ids })

  // Insert rows to card_entity
  const { error } = await supabase.from("card_entity").insert(entities.map((entity) => ({
    card_id: cardId,
    entity_id: entity.entity_id,
    user_id: session.user.id
  })))

  if (error) {
    return res.status(501).json(error)
  }

  return res.status(200).json(entities)
}
