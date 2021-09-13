import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import supabase from '../../utils/supabaseClient'

import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import Card from '../../components/card/Card'

import styles from '../../styles/cardpage.module.css'
import { deleteAndRedirect } from '../../functions/deleteCard'

const CardPage = () => {

    // Get card id from link address
    const router = useRouter()

    // Loading state
    const [loading, setLoading] = useState(true)
    
    // Card state
    const [card, setCard] = useState(null)

    // Card ID (required for deleting the card
    const [card_id, setCardId] = useState(null)

    // State storing list of tags
    const [tagList, setTagList] = useState(null)

    // Get all card details
    const getCard = async (id) => {
        const { data:cards, error } = await supabase
            .from("cards")
            .select(`
                excerpt,
                note,
                created_at,
                tags,
                collections (
                    id,
                    name,
                    author
                )
            `)
            .eq('id', id)

        const { data:tags, err } = await supabase
            .from("tags")
            .select("*")
            .in("id", cards[0].tags)

        if (error) {
            console.log("Error getting card")
            return null
        } else if (err) {
            console.log("Error getting tags")
            return null
        }

        setCard(cards[0])
        
        setTagList(tags)
        
        setLoading(false)

    }

    // Get card details
    useEffect(() => {
        if (!router.isReady) return;

        const { id } = router.query

        setCardId(id)
        getCard(id)
    }, [router.isReady])
    
    return (
        <ProtectedRoute>
            <div className={styles.container}>
                {loading && <Loader />}

                {!loading && (
                    <>
                        <Card 
                            excerpt={card.excerpt} 
                            note={card.note} 
                            tags={tagList}
                            collection={card.collections}
                            date={card.created_at} 
                            deleteFunc={deleteAndRedirect}
                            id={card_id}
                        /> 
                    </>
                )}
            </div>
        </ProtectedRoute>
    )
}

export default CardPage
