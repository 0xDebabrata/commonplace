import supabase from '../utils/supabaseClient'

// Delete card when viewing it under a card page
export const deleteAndRedirect = async (id, router) => {
    await deleteCard(id, router)

    router.push("/")
} 

// Delete card when viewing it under a tag/collection page
export const deleteAndRefresh = async (id, router) => {
    await deleteCard(id, router)

    router.reload(window.location.pathname)

}

const deleteCard = async (id, router) => {

    // Delete card_tag rows
    const { error } = await supabase
        .from("card_tag")
        .delete()
        .eq("card_id", id)

    if (error) {
        console.log(error)
        throw error
    }

    // Delete cards table's row
    const { err } = await supabase
        .from("cards")
        .delete()
        .eq("id", id)

    if (err) {
        console.log(err)
        throw err 
    }

}

