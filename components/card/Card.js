import React from 'react'

import Excerpt from '../new/Excerpt'
import Note from '../new/Note'
import DisplayTags from './DisplayTags'
import Collection from './Collection'

import styles from '../../styles/card.module.css'

const Card = ({ excerpt, note, tags, collection, date }) => {

    return (
        <div className={styles.container}>
            <Excerpt excerpt={excerpt} />
            <div className={styles.tagsContainer}>
                <DisplayTags tags={tags} />
            </div>
            <Note note={note} />
            <Collection collection={collection} />
            <p className={styles.date}>{date}</p>
        </div>
    )
}

export default Card
