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
