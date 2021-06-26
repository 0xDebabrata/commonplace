import React, { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import supabase from '../utils/supabaseClient'

import EditingView from '../components/new/EditingView'
import PreviewCard from '../components/new/PreviewCard'
import styles from '../styles/new.module.css'

export default function New() {

    const [excerpt, setExcerpt] = useState('')
    const [note, setNote] = useState('')

    // Loading user's tags and collections from DB
    const [tagsLoading, setTagsLoading] = useState(true)
    const [collectionsLoading, setCollectionsLoading] = useState(true)

    // User's tags and collections
    const [userTags, setUserTags] = useState(null)
    const [userCollections, setUserCollections] = useState(null)

    // Current tags and collection
    const [tags, setTags] = useState([])
    const [collection, setCollection] = useState(null)


    const handleExcerptChange = () => {
        const excerptVal = document.getElementsByTagName("textarea")[0].value
        setExcerpt(excerptVal)
    }

    const handleNoteChange = () => {
        const noteVal = document.getElementsByTagName("textarea")[1].value
        setNote(noteVal)
    }

    // Get user tags
    const getTags = async () => {
        let { data: tags, error } = await supabase
            .from('tags')
            .select('*')
        
        setTagsLoading(false)
        setUserTags(tags)
    }

    const getCollections = async () => {
        let { data: collections, error } = await supabase
            .from('collections')
            .select('*')
        
        setCollectionsLoading(false)
        setUserCollections(collections)
    }

    useEffect(() => {
        getCollections()
        getTags()
    }, [])

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <EditingView 
                    tags={tags}
                    setTags={setTags}
                    tagsLoading={tagsLoading}
                    collection={collection}
                    setCollection={setCollection}
                    collectionsLoading={collectionsLoading}
                    note={note}
                    excerpt={excerpt}
                    handleNoteChange={handleNoteChange}
                    handleExcerptChange={handleExcerptChange} />
                <div className={styles.previewContainer}>
                    <div className={styles.previewBox}>
                        <h2 className={styles.header}>Preview</h2>
                        <PreviewCard excerpt={excerpt} note={note} />
                    </div>
                </div> 
            </div>
        </ProtectedRoute>
    )
}
