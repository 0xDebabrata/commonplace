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

  const t1start = performance.now()
  // Create embeddings for the query
  const { data } = await createEmbeddings([phrase.trim()], session.user.id)
  const t1end = performance.now()
  console.log("embeddings", -t1start + t1end)
  // Query vectors on Pinecone
  const p1 = queryVectors(data.data[0].embedding, "cards", session.user.id)
  const p2 = queryVectors(data.data[0].embedding, "chunks", session.user.id)

  const t2s = performance.now()
  const [{ data: { matches: res1 } }, { data: { matches: res2 } }] = await Promise.all([p1, p2])
  const t2e = performance.now()
  console.log("search", -t2s + t2e)

  // Get cards from Supabase
  const cardIds = []

  const uniqueChunks = res2.reduce((unique, item) => {
    const exists = unique.find(ele => ele.id === item.id)
    if (!exists && item.score > 0.75) {
      unique.push(item)
    }
    return unique
  }, [])

  let i = 0
  let j = 0
  for (i, j; i < uniqueChunks.length && j < res1.length;) {
    if (uniqueChunks[i].score >= res1[j].score) {
      cardIds.push(parseInt(uniqueChunks[i].id.split("/")[0]))      // ids are of the form {cardId}/{chunkNo}
      i++;
    } else {
      cardIds.push(parseInt(res1[j].id.split("/")[0]))
      j++;
    }
  }

  if (i !== uniqueChunks.length) {
    for (i; i < uniqueChunks.length; i++) {
      cardIds.push(parseInt(uniqueChunks[i].id.split("/")[0]))
    }
  }
  if (j !== res1.length) {
    for (j; j < res1.length && res1[j].score > 0.75; j++) {
      cardIds.push(parseInt(res1[j].id.split("/")[0]))
    }
  }

  const t3s = performance.now()
  const { data: cards } = await supabase.rpc("get_cards_from_ids", {
    card_ids: cardIds
  })
  const t3e = performance.now()
  console.log("rpc", -t3s + t3e)

  return res.status(200).json({ data: cards })
}

