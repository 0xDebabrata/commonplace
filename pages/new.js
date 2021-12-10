import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'
import supabase from '../utils/supabaseClient'
import toast from 'react-hot-toast'
import { useKeyPress } from '../utils/hooks'

import { createCard } from '../functions/new'

import EditingView from '../components/new/EditingView'
import PreviewCard from '../components/new/PreviewCard'
import styles from '../styles/new.module.css'

export default function New() {

    const router = useRouter()

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
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')

    // Set keyboard shortcuts
    useKeyPress(['S'], (e) => handleKeyPress())

    const handleKeyPress = () => {
        const searchInput = document.getElementById("search")

        if (searchInput !== document.activeElement) {
            handleCreateCard()
        }
    }

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
        
        setUserTags(tags)
        setTagsLoading(false)
    }

    const getCollections = async () => {
        let { data: collections, error } = await supabase
            .from('collections')
            .select('*')
        
        setUserCollections(collections)
        setCollectionsLoading(false)
    }

    useEffect(() => {
        getCollections()
        getTags()
    }, [])

    const handleCreateCard = () => {
        const collection = {name: title, author}
        const promise = createCard(excerpt, note, collection, userCollections, tags, userTags)
        toast.promise(promise, {
            loading: "Creating card",
            success: data => {
                router.push(`/card/${data}`)
                console.log(data)
                return "Card created" 
            },
            error: err => {
                return `${err}`
            } 
        },
        {
            style: {
                background: "rgba(105,105,105,0.7)",
                minWidth: "300px",
                color: "white",
                backdropFilter: "blur(10px)"
            }
        })
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <EditingView 
                    userTags={userTags}
                    tags={tags}
                    setTags={setTags}
                    tagsLoading={tagsLoading}

                    userCollections={userCollections}
                    collectionsLoading={collectionsLoading}
                    title={title}
                    setTitle={setTitle}
                    author={author}
                    setAuthor={setAuthor}

                    note={note}
                    excerpt={excerpt}
                    handleNoteChange={handleNoteChange}
                    handleExcerptChange={handleExcerptChange} />
                <div className={styles.previewContainer}>
                    <div className={styles.previewBox}>
                        <h2 className={styles.header}>Preview</h2>
                        <PreviewCard excerpt={excerpt} note={note} />
                        <button
                            className={styles.button}
                            onClick={() => handleCreateCard()}>
                            Create card
                        </button>
                    </div>
                </div> 
            </div>
        </ProtectedRoute>
    )
 }
