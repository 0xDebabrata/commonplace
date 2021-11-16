import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';

import styles from '../styles/tagEdit.module.css'
import 'reactjs-popup/dist/index.css';

import { update } from '../functions/editTag'

const EditTagModal = ({ id, router, open, setOpen, tagName, tagColour }) => {

    // Default tag colout choices
    const colours = ['FFA132', 'F55959', '3FB98D', '5499B1', '6B5BCE', '696969', '14130A']

    // Modal width
    const [width, setWidth] = useState("450px")

    // Tag name input from user
    const [input, setInput] = useState(tagName)

    // Tag colour input from user
    const [selectedColour, setSelectedColour] = useState(tagColour)

    // Handle user selecting colour
    const handleColourSelect = (index) => {
        setSelectedColour(colours[index])
    }

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
                setSelectedColour(tagColour)
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
                    placeholder="Enter tag name" />
            </div>

            <div className={styles.formContainer}>
                <p>Colour</p>
                <div className={styles.colourContainer}>
                    {colours.map((colour, i) => {
                        if (colour === selectedColour) {
                            return (
                                <div 
                                    onClick={() => handleColourSelect(i)}
                                    key={i}
                                    className={styles.colourOption}
                                    style={{
                                        background: '#'+colour,
                                        boxShadow: '0 0 15px #'+colour,
                                    }} />
                            )
                        } else {
                            return (
                                <div 
                                    onClick={() => handleColourSelect(i)}
                                    key={i}
                                    className={styles.colourOption}
                                    style={{
                                        background: '#'+colour,
                                    }} />
                            )
                        }
                    })}
                </div>
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
                    update(id, router, input, selectedColour)
                }}
            >
                Update 
            </button>
        </Popup>
    )
}

export default EditTagModal 
