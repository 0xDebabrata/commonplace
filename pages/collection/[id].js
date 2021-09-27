import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import supabase from '../../utils/supabaseClient'

import ProtectedRoute from '../../components/ProtectedRoute'
import NewCardButton from '../../components/NewCardButton'
import Loader from '../../components/Loader'
import Card from '../../components/card/Card'
import CollectionHeader from '../../components/CollectionHeader'

import styles from '../../styles/collectionPage.module.css'

const CollectionPage = () => {

    // Get card id from link address
    const router = useRouter()

    // Cards Loading state
    const [loading, setLoading] = useState(true)

    // Collection id
    const [id, setId] = useState(null)
    
    // Array of cards having a certain tag
    const [cardArray, setCardArray] = useState(null)

    // Current collection name
    const [collectionName, setCollectionName] = useState(null)

    // Current collection author 
    const [collectionAuthor, setCollectionAuthor] = useState(null)

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
            .eq('collection_id', [id])
            .order('created_at', { ascending: false })

        console.log("cards", cards)
        if (error) {
            console.log("Error getting card")
            return null
        } 

        // Handle no cards featuring the collection 
        if (cards.length === 0) {

            // Get collection details
            const {data: collection, err} = await supabase
                .from("collections")
                .select("*")
                .eq("id", id)

            // If no collection with given id exists
            if (collection.length === 0) {
                setNoCard(true)
                setLoading(false)
                return
            }

            setCollectionName(collection[0].name)
            setCollectionAuthor(collection[0].author)
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
        setId(id)
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
                            <CollectionHeader
                                collectionName={collectionName}
                                collectionAuthor={collectionAuthor}
                                allowDelete={false}
                                id={id}
                                router={router}
                            />
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

                        {noCard && collectionName && (
                            <CollectionHeader
                                collectionName={collectionName}
                                collectionAuthor={collectionAuthor}
                                allowDelete={true}
                                id={id}
                                router={router}
                            />
                        )}

                        {noCard && !collectionName && (
                            <p>
                                No such collection exists
                            </p>
                        )}
                    </>
                )}
            </div>
            <NewCardButton />
        </ProtectedRoute>
    )
}

export default CollectionPage 
