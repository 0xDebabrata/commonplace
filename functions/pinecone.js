export const insertVectors = async (cards, openAiData, namespace, user_id) => {
  const vectors = []
  openAiData.forEach((data, i) => {
    vectors.push({
      id: cards[i].id.toString(),
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
      body: JSON.stringify({ vectors, namespace })
    })

    if (resp.headers.get("Content-Type") === "text/plain") {
      return { data: await resp.text() }
    }
    return { data: await resp.json() }
  } catch (error) {
    throw error
  }
}

export const queryVectors = async (queryEmbedding, namespace, user_id) => {
  try {
    const resp = await fetch(`${process.env.PINECONE_URL}/query`, {
      method: "POST",
      headers: {
        "Api-Key": `${process.env.PINECONE_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        vector: queryEmbedding,
        namespace,
        topK: 5,
        filter: { user_id },
        includeValues: false,
        includeMetadata: true,
      })
    })

    return { data: await resp.json() }
  } catch (error) {
    throw error
  }

}
