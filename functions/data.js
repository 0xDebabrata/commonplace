  export const getExcerpts = (cardArr, setExcerptsArr) => {
    const excerpts = []
    for (const card of cardArr) {
      const { id, plain_excerpt } = card
      excerpts.push({
        excerpt: plain_excerpt,
        id
      })
    }
    setExcerptsArr(excerpts)
  }
