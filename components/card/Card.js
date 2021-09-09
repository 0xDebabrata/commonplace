import React from 'react'

import Excerpt from '../new/Excerpt'
import Note from '../new/Note'
import DisplayTags from './DisplayTags'
import Collection from './Collection'
import DisplayDate from './Date'

import styles from '../../styles/card.module.css'

const Card = ({ excerpt, note, tags, collection, date }) => {

    return (
        <div className={styles.container}>
            <Excerpt excerpt={excerpt} />
            <div className={styles.tagsContainer}>
                <DisplayTags tags={tags} />
            </div>
            <Note note={note} />
            {collection.name && collection.author && <Collection collection={collection} />
}
            <DisplayDate date={date} />
        </div>
    )
}

export default Card
