import supabase from '../utils/supabaseClient'

// Return array of tag ids for cards table
const getTagIds = async (tags, userTags) => {
    const tagIds = []
    const newTags = []
    // tags contains a string (userTags) or an object (which needs to be uploaded)
    tags.map(tag => {
        if (tag.name) {
            // Add tag to newTags for inserting multiple rows
            newTags.push(tag)
        } else {
            // Improve speed by directly adding the tag_id of selected tag suggestion
            for (let i=0; i<userTags.length; i++) {
                if (userTags[i].name === tag) {
                    tagIds.push(userTags[i].id)
                }
            }
        }
    })

    // Insert new tags to tags table
    const { data, error } = await supabase
        .from("tags")
        .insert(newTags)

    if (error) {
        alert("There was an error in setting up your tags")
        return null
    }

    // Extract new tag ids to push to newTags
    data.map(tag => {
        tagIds.push(tag.id)
    })

    return tagIds
}

// Return card ID from cards table
const getCollectionId = async (collection, userCollections, user_id) => {
    
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
            alert("There was an error in setting up your collection")
            return null
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
        alert("Please add a note or an excerpt")
        return null
    }

    if (tags.length === 0) {
        alert("Please add tags to your card")
        return null
    }

    card.user_id = user_id
    card.collection_id = await getCollectionId(collection, userCollections, user_id)
    card.tags = await getTagIds(tags, userTags)
    card.excerpt = excerpt
    card.note = note
    var nowDate = new Date(); 
    var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
    card.created_at = date

    const { data, error } = await supabase
        .from("cards")
        .insert([card])

    if (error) {
        alert("There was an error in creating your card")
    } else {
        alert("Card created")
    }
}











