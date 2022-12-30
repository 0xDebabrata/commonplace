const removeUrl = (bookmark) => {
  let str = ""
  let initialPos = 0;
  let count = bookmark.entities?.urls?.length
  for (let i = 0; i < count; i++) {
    str += bookmark.text.substring(initialPos, bookmark.entities.urls[i].start + 1);
    initialPos = bookmark.entities.urls[i].end + 1
  }

  return count ? str : bookmark.text
}

export const clean = (bookmarks) => {
  const cleanTexts = bookmarks.map(bookmark => {
    // Remove URL
    let text = removeUrl(bookmark)
    // Remove emojis
    text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    // Remove extra whitespaces
    text = text.replace(/\s\s+/g, ' ')

    return text
  })

  return cleanTexts
}
