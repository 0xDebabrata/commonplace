import React, { useState, useEffect, useContext } from 'react'
import Popup from 'reactjs-popup';
import Loader from '../Loader'
import TagSuggestions from './TagSuggestions'

import { UserContext } from '../../utils/context'

import 'reactjs-popup/dist/index.css';
import styles from '../../styles/tagList.module.css'

const NewTag = ({ userTags, loading, setTags }) => {

    const { user } = useContext(UserContext)

    // Modal state
    const [open, setOpen] = useState(false)
    
    // Tag name input from user
    const [input, setInput] = useState('')

    // Tag colour input from user
    const [selectedColour, setSelectedColour] = useState(null)

    // Width of popup
    const [width, setWidth] = useState("470px")

    // Function to close modal
    const closeModal = () => {
        setOpen(false)
        setInput('')
        setSelectedColour(null)
    } 

    // Default tag colout choices
    const colours = ['FFA132', 'F55959', '3FB98D', '5499B1', '6B5BCE', '696969', '14130A']

    // Handle user selecting colour
    const handleColourSelect = (index) => {
        setSelectedColour(colours[index])
    }

    // Handle create tag button click
    const handleClick = () => {
        if (input) {
            if (selectedColour) {
                // Create tag
                const newTag = { 
                    user_id: user.id,
                    name: input, 
                    colour: selectedColour 
                }
                setTags(oldTags => [...oldTags, newTag])
                closeModal()
            } else {
                alert("Please select a colour for your tag")
            }
        } else {
            alert("Please add a name for your tag")
        }
    }

    // Set width of popup to 300px if screen width <= 480px
    useEffect(() => {
        const x = window.matchMedia("(max-width: 480px)")
        if (x.matches) {
            setWidth("300px")
        }
    })

    // Popup styling
    const contentStyle = { 
        width: width,
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        padding: '20px'
    };
    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    return (
        <>
            <img 
                onClick={() => setOpen(true)}
                src="/newtag-icon.svg" 
                alt="New tag (plus) icon" 
                className={styles.icon} />
            <Popup 
                className="modal" 
                open={open} 
                closeOnDocumentClick closeOnEscape 
                onClose={closeModal}
                overlayStyle={overlayStyle}
                contentStyle={contentStyle}>


                {loading && (
                    <Loader />
                )}

                {!loading && ( <>
                    <img 
                        onClick={() => setOpen(false)}
                        src="/newtag-icon.svg"
                        alt="Close popup icon"
                        className={styles.closeButton} />

                    <div className={styles.formContainer}>
                        <p>Name</p>
                        <input
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

                    <div className={styles.suggestionContainer}>
                        <p>Suggestion</p>
                        <div className={styles.suggestions}>
                            <TagSuggestions 
                                setTags={setTags}
                                userTags={userTags} 
                                input={input}
                                closeModal={closeModal} />
                        </div>
                    </div>

                    <button 
                        onClick={() => handleClick()}
                        className={styles.button}>
                        Create tag
                    </button>
                </> )}
            </Popup>
        </>
    )
}

export default NewTag 
