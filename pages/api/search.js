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

  const { data } = await createEmbeddings([phrase.trim()], session.user.id)
  const { data: results } = await queryVectors(data.data[0].embedding, "cards", session.user.id)

  return res.status(200).json({ results })
}

