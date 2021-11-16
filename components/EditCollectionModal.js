import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';

import styles from '../styles/tagEdit.module.css'
import 'reactjs-popup/dist/index.css';

import { update } from '../functions/editCollection'

const EditCollectionModal = ({ id, router, open, setOpen, collectionName, collectionAuthor }) => {

    // Modal width
    const [width, setWidth] = useState("450px")

    // Collection name input from user
    const [input, setInput] = useState(collectionName)

    // Collection author input from user
    const [author, setAuthor] = useState(collectionAuthor)

    // Popup styling
    const contentStyle = { 
        width: width,
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        padding: '20px 30px 20px 30px'
    };
    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    // Set width of popup to 300px if screen width <= 480px
    useEffect(() => {
        const x = window.matchMedia("(max-width: 480px)")
        if (x.matches) {
            setWidth("300px")
        }
    }, [])

    return (
        <Popup 
            className="modal" 
            open={open} 
            closeOnDocumentClick closeOnEscape 
            onClose={() => {
                setInput(collectionName)
                setAuthor(collectionAuthor)
                setOpen(false)
            }}
            overlayStyle={overlayStyle}
            contentStyle={contentStyle}
        >
            <div className={styles.formContainer}>
                <p>Name</p>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter name" />
                <p>Author</p>
                <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author" />
            </div>

            <button
                className={styles.cancelBtn}
                onClick={() => setOpen(false)}
            >
                Cancel
            </button>
            <button
                className={styles.updateBtn}
                onClick={() => {
                    setOpen(false)
                    update(id, router, input, author)
                }}
            >
                Update 
            </button>
        </Popup>
    )
}

export default EditCollectionModal 
