import supabase from '../utils/supabaseClient'

// Insert new tags to tags table and card tags to card_tag table 
// Return array of tag ids for the card
const handleTags = async (tags, userTags, user_id) => {
    const card_tags = []
    const newTags = []
    const tagIds = []

    // tags contains a string (userTags) or an object (which needs to be uploaded)
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

    return { tagIds, card_tags } 
}


// Insert rows into card_tag table
const postToJunctionTable = async (card_tags, card_id) => {

    card_tags.forEach(tag => {
        tag.card_id = card_id
    })

    // Insert rows to card_tag junction table
    const { card_tagData, card_tagError } = await supabase
        .from("card_tag")
        .insert(card_tags)

    if (card_tagError) {
        throw error
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

// Create new card
export const createCard = async (excerpt, note, collection, userCollections, tags, userTags ) => {
    const card = {}
    const user_id = supabase.auth.user().id

    if (!note && !excerpt) {
        throw new Error("Please add a note or an excerpt")
    }

    if (tags.length === 0) {
        throw new Error("Please add a tag to your card") 
    }

    const { tagIds, card_tags } = await handleTags(tags, userTags, user_id)

    card.user_id = user_id
    card.collection_id = await getCollectionId(collection, userCollections, user_id)
    card.excerpt = excerpt
    card.note = note
    card.tags = tagIds 

    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    card.created_at = date

    const { data, error } = await supabase
        .from("cards")
        .insert([card])

    if (error) {
        throw error
    } 

    const card_id = data[0].id
    await postToJunctionTable(card_tags, card_id)

    return card_id
}


