import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import supabase from '../utils/supabaseClient'

import Loader from '../components/Loader'
import NewCardButton from '../components/NewCardButton'
import TagBlock from '../components/TagBlock'

import styles from '../styles/Home.module.css'

export default function Home() {

    // User's tags
    const [tags, setTags] = useState(null)

    // Loading state
    const [loading, setLoading] = useState(true)

    // Get user's tags from db
    const getTags = async () => {
        const { data: tags, error } = await supabase
            .from("tags")
            .select("*")

        if (error) {
            console.log(error)
            return null
        } else {
            setTags(tags)
            console.log(tags)
            setLoading(false)
        }
    }

    // Load tags on page load
    useEffect(() => {
        getTags()
    }, [])

    return (
        <ProtectedRoute>
            {loading && <Loader />}

            {!loading && (
                <div className={styles.container}>
                    <>
                        {tags.map(tag => {
                            return <TagBlock tag={tag} />
                        })}
                    </>
                    <NewCardButton />
                </div>
            )}
        </ProtectedRoute>
  )
}
