import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'
import supabase from '../utils/supabaseClient'
import toast from 'react-hot-toast'

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

    const handleExcerptChange = () => {
        const excerptVal = document.getElementsByTagName("textarea")[0].value
        setExcerpt(excerptVal)
    }

    const handleNoteChange = () => {
        const noteVal = document.getElementsByTagName("textarea")[1].value
        setNote(noteVal)
    }

    // Get card details
    const getCard = async (id) => {
        let { data: card, error } = await supabase
            .from("cards")
            .select(`
                id,
                collections (
                    id,
                    name,
                    author
                ),
                card_tag (
                    tags (
                        id,
                        name,
                        colour
                    )
                ),
                excerpt,
                note,
                created_at
            `)
            .eq("id", id)

        console.log(card[0])

        // Create tags array
        const tagsArray = []
        card[0].card_tag.forEach(tag => {
            tagsArray.push(tag.tags)
        })

        setExcerpt(card[0].excerpt)
        setNote(card[0].note)
        setTags(tagsArray)
        setTitle(card[0].collections.name)
        setAuthor(card[0].collections.author)
        
    }

    // Get user's tags
    const getTags = async () => {
        let { data: tags, error } = await supabase
            .from('tags')
            .select('*')
        
        setUserTags(tags)
        setTagsLoading(false)
    }

    // Get user's collections
    const getCollections = async () => {
        let { data: collections, error } = await supabase
            .from('collections')
            .select('*')
        
        setUserCollections(collections)
        setCollectionsLoading(false)
    }

    useEffect(() => {

        if (!router.isReady) return

        const { id } = router.query

        getCard(id)
        getCollections()
        getTags()

    }, [router.isReady, router.query])

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
                            Update card
                        </button>
                    </div>
                </div> 
            </div>
        </ProtectedRoute>
    )
 }
