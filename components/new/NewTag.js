import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import Loader from '../Loader'
import TagSuggestions from './TagSuggestions'

import 'reactjs-popup/dist/index.css';
import styles from '../../styles/tagList.module.css'

const NewTag = ({ userTags, loading, setTags }) => {

    // Modal state
    const [open, setOpen] = useState(false)
    
    // Tag name input from user
    const [input, setInput] = useState('')

    // Function to close modal
    const closeModal = () => setOpen(false)

    // Default tag colout choices
    const colours = ['#F38300', '#F55959', '#3FB98D', '#5499B1', '#4543B6', '#696969', '#14130A']

    // Update tag name input change
    const handleInputChange = () => {
        const userInput = document.getElementsByTagName("input")[0].value
        setInput(userInput)
    }

    // Popup styling
    const contentStyle = { 
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
                            onChange={handleInputChange}
                            placeholder="Enter tag name" />
                    </div>

                    <div className={styles.suggestionContainer}>
                        <p>Suggestion</p>
                        <TagSuggestions 
                            setTags={setTags}
                            userTags={userTags} 
                            input={input}
                            closeModal={closeModal} />
                    </div>

                    <div className={styles.formContainer}>
                        <p>Colour</p>
                        {colours.map((colour, i) => {
                            return (
                                <div 
                                    key={i}
                                    className={styles.colourOption}
                                    style={{
                                        background: colour,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        marginLeft: "15px"
                                    }} />
                            )
                        })}
                    </div>

                    <button>
                        Create tag
                    </button>
                </> )}
            </Popup>
        </>
    )
}

export default NewTag 
