import supabase from '../utils/supabaseClient'

const uncategorised = async (userTags, userId) => {
    return new Promise(async (resolve, reject) => {
        let flag = 1 
        userTags.map(tag => {
            if (tag.name.toLowerCase() === "uncategorised" || tag.name.toLowerCase() === "uncategorized") {
                flag = 0
                resolve(tag.id)
            } 
        })

        if (flag) {
            const { data, error } = await supabase
                .from("tags")
                .insert([{
                    name: "Uncategorised",
                    colour: "696969",
                    user_id: userId
                }])

            if (error) {
                throw new Error(error.message)
            } else {
                resolve(data[0].id)
            }
        }
    })
}

// Insert new tags to tags table and card tags to card_tag table 
// Return array of tag ids for the card
const handleTags = async (tags, userTags, user_id) => {
    return new Promise(async (resolve, reject) => {
        const card_tags = []
        const newTags = []
        const tagIds = []

        if (tags.length === 0) {
            uncategorised(userTags, user_id)
                .then(tag_id => {
                    console.log(tag_id)
                    console.log({
                        tagIds: [tag_id], 
                        card_tags: [{ tag_id, user_id }] 
                    })
                    resolve({ 
                        tagIds: [tag_id], 
                        card_tags: [{ tag_id, user_id }] 
                    })
                })
        } else {
            // Filter newly created tags from user's tags which need to be added to junction table
            tags.map(tag => {
                if (tag.user_id) {
                    // Add tag to newTags for inserting multiple rows
                    newTags.push(tag)
                } else {
                    card_tags.push({
                        tag_id: tag.id,
                        user_id
                    })

                    tagIds.push(tag.id)
                }
            })

            // Insert new tags to tags table
            const { data, error } = await supabase
                .from("tags")
                .insert(newTags)

            if (error) {
                throw error 
            }

            // Extract new tag ids to push to newTags
            data.map(tag => {
                card_tags.push({
                    tag_id: tag.id,
                    user_id
                })

                tagIds.push(tag.id)
            })

            resolve({ tagIds, card_tags })
        }
    })
}


// Insert rows into card_tag table
const postToJunctionTable = async (card_tags, card_id) => {

    card_tags.forEach(tag => {
        tag.card_id = card_id
    })

    // Insert rows to card_tag junction table
    const { card_tagData, card_tagError } = await supabase
        .from("card_tag")
        .insert(card_tags, { upsert: true })

    if (card_tagError) {
        throw new Error(error)
    }

}


// Return card ID from cards table
const getCollectionId = async (collection, userCollections, user_id) => {

    if (!collection.name) return null
    
    let collectionId
    // Check if collection already exists
    userCollections.map(userCollection => {
        if (userCollection.name.toLowerCase() === collection.name.toLowerCase()
            && userCollection.author.toLowerCase() === collection.author.toLowerCase()) {
            collectionId = userCollection.id
        }
    })

    // If collection does not exist, insert it to collections table
    if (!collectionId) {
        collection.user_id = user_id
        const { data, error } = await supabase
            .from("collections")
            .insert([collection])

        if (error) {
            throw error
        }

        collectionId = data[0].id
    }

    return collectionId

}

// Delete removed tags from card_tag junction table
const deleteJunctionRows = async (card_id, tag_id) => {
    const { data, error } = await supabase
        .from("card_tag")
        .delete()
        .match({ card_id, tag_id })

    if (error) {
        throw error
    }
}

// Update card
export const updateCard = async (excerpt, note, collection, userCollections, tags, userTags, date, cardId, deleteRows) => {

    // Delete rows from junction table
    deleteRows.forEach(async (id) => {
        await deleteJunctionRows(cardId, id)
    })

    const card = {}
    const user_id = supabase.auth.user().id

    if (!note && !excerpt) {
        throw new Error("Please add a note or an excerpt")
    }

    const { tagIds, card_tags } = await handleTags(tags, userTags, user_id)

    card.user_id = user_id
    card.collection_id = await getCollectionId(collection, userCollections, user_id)
    card.excerpt = excerpt
    card.note = note
    card.tags = tagIds 

    card.created_at = date

    const { data, error } = await supabase
        .from("cards")
        .update(card)
        .eq("id", cardId)

    if (error) {
        throw error
    } 

    await postToJunctionTable(card_tags, cardId)
}


