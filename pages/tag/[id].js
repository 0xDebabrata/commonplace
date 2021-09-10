import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import supabase from '../../utils/supabaseClient'

import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import Card from '../../components/card/Card'

import styles from '../../styles/tagPage.module.css'

const TagPage = () => {

    // Get card id from link address
    const router = useRouter()

    // Cards Loading state
    const [loading, setLoading] = useState(true)
    
    // Array of cards having a certain tag
    const [cardArray, setCardArray] = useState(null)

    // Current tag name
    const [tagName, setTagName] = useState(null)

    // Current tag colour
    const [tagColour, setTagColour] = useState(null)

    // Whether any card is available
    const [noCard, setNoCard] = useState(false)

    // Get all card details
    const getCard = async (id) => {
        const { data:cards, error } = await supabase
            .from("cards")
            .select(`
                id,
                excerpt,
                note,
                created_at,
                tags,
                card_tag (
                    tags (
                        id,
                        name,
                        colour
                    )
                ),
                collections (
                    id,
                    name,
                    author
                )
            `)
            .contains('tags', [id])
            .order('created_at', { ascending: false })

        if (error) {
            console.log("Error getting card")
            return null
        } 

        // Handle no cards having the tag
        if (cards.length === 0) {

            // Get tag details
            const {data: tag, err} = await supabase
                .from("tags")
                .select("*")
                .eq("id", id)

            setTagName(tag[0].name)
            setTagColour(tag[0].colour)
            setNoCard(true)
            setLoading(false)
            return
        }

        // Produce an array of tags for each card
        cards.forEach(card => {
            const tempTagArray = []
            card.card_tag.forEach(tagObject => {
                tempTagArray.push(tagObject.tags)
            })
            card.card_tag = tempTagArray
        })

        // Get current tag name
        cards[0].card_tag.forEach(tagObject => {
            if (tagObject.id === parseInt(id)) {
                setTagName(tagObject.name)
                setTagColour(tagObject.colour)
            }
        })

        setCardArray(cards)
        setLoading(false)
    }

    // Get card details
    useEffect(() => {
        if (!router.isReady) {
            setLoading(true)
            return
        } 

        const { id } = router.query
        getCard(id)

    }, [router.isReady, router.query])
    
    return (
        <ProtectedRoute>
            <div className={styles.container}>
                {loading && <Loader />}

                {!loading && (
                    <>
                    {!noCard && (
                        <>
                            <h2 
                                className={styles.header}
                            >
                                Tag
                                <span
                                    className={styles.tag}
                                    style={{
                                        color: `#${tagColour}`
                                    }}>
                                    {tagName}
                                </span>
                            </h2>
                            {cardArray.map(card => {
                                return ( 
                                    <Card
                                        key={card.id}
                                        excerpt={card.excerpt}
                                        note={card.note}
                                        tags={card.card_tag}
                                        collection={card.collections}
                                        date={card.created_at} />
                                )
                            })}
                        </>
                    )}
                    {noCard && (
                        <h2 
                            className={styles.header}
                        >
                            Tag
                            <span
                                className={styles.tag}
                                style={{
                                    color: `#${tagColour}`
                                }}>
                                {tagName}
                            </span>
                        </h2>
                    )}

                    </>
                )}
            </div>
        </ProtectedRoute>
    )
}

export default TagPage 
