import { clean } from "./embeddings";

export const getSmartCollections = async (supabase, user_id) => {
  const { data, error } = await supabase
    .rpc("get_smart_collections", {
      user_id_input: user_id
    })
  return { data: !error ? data : [] }
}

export const enqueueBookmarks = async (supabase, next_token, twitter_account_id, user_id) => {
  const { error } = await supabase.from("queue").insert({
    meta: {
      twitter_account_id,
      next_token,
    },
    user_id,
  })
  if (error) throw error
  console.log("Added to queue\n")
}

export const insertBookmarks = async (supabase, bookmarks, user_id) => {
  const cards = []
  const domains = new Map()
  const entities = new Map()
  const tweet_entity = new Map()
  const cleanTexts = clean(bookmarks)   // No point keeping urls since all of them are shortened by Twitter anyway

  bookmarks.forEach((bookmark, i) => {
    const rows = []                     // Row in card_entity table

    bookmark.context_annotations?.forEach(annotation => {
      const domain = { id: "", name: null, description: null }
      const entity = { id: "", domain_id: "", name: null, description: null }
      domains.set(annotation.domain.id, {
        ...domain,
        ...annotation.domain
      })
      entities.set(annotation.entity.id, {
        ...entity,
        ...annotation.entity,
        domain_id: annotation.domain.id
      })
      rows.push({
        entity_id: annotation.entity.id,
        user_id,
      })
    })

    const card = { 
      data: bookmark.text, 
      plain: {
        data: cleanTexts[i]
      },
      meta: {
        id: bookmark.id,
        lang: bookmark.lang,
        author_id: bookmark.author_id,
        entities: bookmark.entities,
        edit_history_tweet_ids: bookmark.edit_history_tweet_ids
      },
      user_id,
    }
    cards.push(card)

    tweet_entity.set(bookmark.id, rows) // rows will be empty [] if context_annotations DNE
  })

  try {
    const res1 = await supabase.from("domains").upsert(Array.from(domains.values()))
    if (res1.error) throw res1.error

    const res2 = await supabase.from("entities").upsert(Array.from(entities.values()))
    if (res2.error) throw res2.error

    console.log("Inserted domains and entities\n")

    const { data, error } = await supabase.from("cards").insert(cards).select()
    if (error) {
      throw error
    }
    console.log("Inserted cards\n")

    const cardEntityRows = []
    const sources = []
    for (let i = 0; i < data.length; i++) {
      sources.push({
        card_id: data[i].id,
        source: {
          type: "twitter",
          author_id: bookmarks[i].author_id,
        }
      })

      // Add to card_entity
      // Nothing happens if rows is empty []
      const rows = tweet_entity.get(data[i].meta.id)
      rows.forEach(val => {
        cardEntityRows.push({ ...val, card_id: data[i].id })
      })
    }

    const res3 = await supabase.from("card_entity").insert(unique(cardEntityRows))
    if (res3.error) throw res3.error
    const res4 = await supabase.from("sources").insert(sources)
    if (res4.error) throw res4.error

    console.log("Inserted card entity relations\n")

    return data
  } catch (error) {
    throw error
  }
}

const unique = (arr) => {
  const uniqueArr = arr.filter((element, i, self) => {
    const hasDuplicate = self.findIndex(e => e.entity_id === element.entity_id && e.card_id === element.card_id)
    return hasDuplicate === i
  })

  return uniqueArr
}

export const upsertAuthors = async (supabase, users) => {
  const { error } = await supabase.from("twitter_users").upsert(users)
  if (error) throw error
  console.log("Authors inserted\n")
}
