import React from 'react'
import { useRouter } from 'next/router'

import styles from '../styles/tag.module.css'

const Tag = ({ newCard, name, colour, id, preview, setTags, index, click, deleteRows, setDeleteRows }) => {

    const router = useRouter()

    const handleDelete = (index) => {
        setTags(oldTags => {
            oldTags.splice(index, 1)
            return [...oldTags]
        })

        // If tag already exists in user's tags, add to deleteRows to delete required rows from card_tag table when card is updated
        // If card is new, then don't attempt this
        if (id && !newCard) {
            setDeleteRows(prev => [...prev, id])
        }
    }

    // Redirect user to tag page on clicking on the tag
    const handleClick = (id, e) => {
        if (click) {
            e.preventDefault()
            router.push(`/tag/${id}`)
        }
    }

    return (
        <div
            onClick={(e) => handleClick(id, e)}
            style={{
                cursor: 'pointer',
                height: '30px',
                paddingLeft: '20px',
                paddingRight: '20px',
                background: '#'+colour,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: '10px',
                borderRadius: '7px',
                background: 'linear-gradient(180deg, #'+colour+'BD 0%, #'+colour+' 100%)',
                boxShadow: 'inset 0 0 10px #'+colour, 
                backdropFilter: 'blur(30px)',
                margin: '5px 5px',
                maxWidth: '330px',
            }}>
            <p className={styles.name}>{name}</p>

            {preview && (
                <img 
                    src="/cross-icon.svg" alt="Remove tag"
                    onClick={() => handleDelete(index)}
                    className={styles.icon} />
            )}
        </div>
    )
}

export default Tag
