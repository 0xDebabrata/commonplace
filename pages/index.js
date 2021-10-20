import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import supabase from '../utils/supabaseClient'
import { UserContext } from '../utils/context' 

import Homepage from '../components/home/Homepage'
import Loader from '../components/Loader'
import NewCardButton from '../components/NewCardButton'
import TagBlock from '../components/TagBlock'
import Collections from '../components/index/Collections'

import styles from '../styles/Home.module.css'

export default function Home() {

    const router = useRouter()

    const { user } = useContext(UserContext)

    // User's tags
    const [tags, setTags] = useState(null)

    // User's collections
    const [collections, setCollections] = useState(null)

    // Loading state for tags
    const [tagsLoading, setTagsLoading] = useState(true)
    // Loading state for collections
    const [collectionsLoading, setCollectionsLoading] = useState(true)

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
            setTagsLoading(false)
        }
    }

    // Get user's collections from db
    const getCollections = async () => {
        const { data: collections, error } = await supabase
            .from("collections")
            .select("*")

        if (error) {
            console.log(error)
            return null
        } else {
            setCollections(collections)
            setCollectionsLoading(false)
        }
    }

    // Load tags on page load after making sure user's authenticated
    useEffect(() => {

        if (supabase.auth.user()) {
            getTags()
            getCollections()
        }

    }, [supabase.auth.user()])

    return (
        <>
        { user && (
            <>
            {tagsLoading || collectionsLoading && <Loader />}

            {!tagsLoading && !collectionsLoading && (
                <>
                    <h2 className={styles.header}>Tags</h2>
                    <div className={styles.container}>
                        <>
                            {tags.map(tag => {
                                return <TagBlock key={tag.id} tag={tag} />
                            })}
                        </>
                        <NewCardButton />
                    </div>
                    <Collections
                        collections={collections}
                    />
                </>
            )}
            </>
        )}

        {!user && <Homepage />}
        </>
  )
}
