import supabase from '../utils/supabaseClient'

// Return array of tag ids for cards table
export const getTagIds = async (tags, userTags) => {
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

    // Extract new tag ids to push to newTags
    data.map(tag => {
        tagIds.push(tag.id)
    })

    return tagIds
}

// Return card ID from cards table
export const getCollectionId = async (collection, userCollections) => {
    
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
        collection.user_id = supabase.auth.user().id
        const { data, error } = await supabase
            .from("collections")
            .insert([collection])

        collectionId = data[0].id
    }

    console.log(collectionId)
    return collectionId

}













