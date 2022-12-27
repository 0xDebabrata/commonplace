export const insert = async (cards, openAiData, user_id) => {
  const vectors = []
  openAiData.forEach((data, i) => {
    vectors.push({
      id: toString(cards[i].id),
      values: data.embedding,
      metadata: { user_id, type: "twitter" }
    })
  })

  try {
    const resp = await fetch(`${process.env.PINECONE_URL}/vectors/upsert`, {
      method: "POST",
      headers: {
        "Api-Key": `${process.env.PINECONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vectors, namespace: "cards" })
    })

    if (resp.headers.get("Content-Type") === "text/plain") {
      return { data: await resp.text() }
    }
    return { data: await resp.json() }
  } catch (error) {
    throw error
  }
}
