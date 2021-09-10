import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import supabase from '../../utils/supabaseClient'

import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import Card from '../../components/card/Card'

import styles from '../../styles/collectionPage.module.css'

const TagPage = () => {

    // Get card id from link address
    const router = useRouter()

    // Cards Loading state
    const [loading, setLoading] = useState(true)
    
    // Array of cards having a certain tag
    const [cardArray, setCardArray] = useState(null)

    // Current collection name
    const [collectionName, setCollectionName] = useState(null)

    // Current collection author 
    const [collectionAuthor, setCollectionAuthor] = useState(null)

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
            .eq('collection_id', [id])
            .order('created_at', { ascending: false })

        console.log("cards", cards)
        if (error) {
            console.log("Error getting card")
            return null
        } 

        // Produce an array of tags for each card
        cards.forEach(card => {
            const tempTagArray = []
            card.card_tag.forEach(tagObject => {
                tempTagArray.push(tagObject.tags)
            })
            card.card_tag = tempTagArray
        })

        setCollectionName(cards[0].collections.name)
        setCollectionAuthor(cards[0].collections.author)

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
                        <div className={styles.wrapper}>
                            <h2 className={styles.header}>
                                Collection 
                            </h2>
                            <span>
                                <h2 className={styles.name}>
                                    {collectionName}
                                </h2>
                                <h3 className={styles.author}>
                                    {collectionAuthor}
                                </h3>
                            </span>
                        </div>
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
            </div>
        </ProtectedRoute>
    )
}

export default TagPage 
