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
