import React from 'react'

import styles from '../styles/tag.module.css'

const Tag = ({ name, colour, preview, setTags, index }) => {

    const handleDelete = (index) => {
        setTags(oldTags => {
            oldTags.splice(index, 1)
            return [...oldTags]
        })
    }

    return (
        <div
            style={{
                cursor: 'pointer',
                height: '30px',
                paddingLeft: '15px',
                paddingRight: '15px',
                background: '#'+colour,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '7px',
                margin: '0 5px',
                marginTop: '5px'
            }}>
            {name}

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
