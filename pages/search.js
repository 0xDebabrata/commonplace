import { useRouter } from "next/router"
import {useEffect, useState} from "react"
import supabase from "../utils/supabaseClient"

import Loader from "../components/Loader"
import Card from "../components/card/Card"
import NewCardButton from "../components/NewCardButton"

import { useKeyPress } from "../utils/hooks"
import { onKeyPress } from "../functions/keyboard"
import { deleteAndRefresh } from "../functions/deleteCard"

import styles from "../styles/search.module.css"

const Search = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [cardArray, setCardArray] = useState(null)

    // Set keyboard shortcuts
    useKeyPress(['N'], (e) => onKeyPress(e, router))

    useEffect(() => {
        if (!router.isReady) return;

        const { phrase } = router.query

        fetch("/api/search", {
            method: "POST",
            body: JSON.stringify({
                search: phrase,
                user_id: supabase.auth.user().id
            })
        })
            .then(resp => resp.json())
            .then(data => {
                setCardArray(data.response)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
            }) 
            

    }, [router.isReady, router.query])

    return (
        <div className={styles.container}>
            { loading ? <Loader /> :
                    cardArray.length !== 0 ?
                        cardArray.map(card => {
                            return (
                                <Card
                                    key={card.id}
                                    excerpt={card.excerpt}
                                    note={card.note}
                                    tags={card.card_tag}
                                    collection={card.collections}
                                    date={card.created_at} 
                                    deleteFunc={deleteAndRefresh}
                                    id={card.id}
                                />
                            )
                        })
                        :
                            <p>No cards found</p>
            }
            <NewCardButton />
        </div>
    )
}

export default Search
