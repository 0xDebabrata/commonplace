const removeUrl = (text) => {
  return text.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi, '');
}

export const clean = (bookmarks) => {
  const cleanTexts = bookmarks.map(bookmark => {
    // Remove URL
    let text = removeUrl(bookmark.text)
    // Remove emojis
    text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    // Remove extra whitespaces
    text = text.replace(/\s\s+/g, ' ')

    return text
  })

  return cleanTexts
}
