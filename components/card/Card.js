import React from 'react'

import Excerpt from '../new/Excerpt'
import Note from '../new/Note'
import DisplayTags from './DisplayTags'
import Collection from './Collection'
import DisplayDate from './Date'
import DeleteCard from './Delete'

import styles from '../../styles/card.module.css'

const Card = ({ excerpt, note, tags, collection, date, deleteFunc, id }) => {

    return (
        <div className={styles.container}>
            <DisplayDate date={date} />
            <Excerpt excerpt={excerpt} />
            <div className={styles.tagsContainer}>
                <DisplayTags tags={tags} />
            </div>
            <Note note={note} />
            <div className={styles.wrapper}>
                {collection.name && (<Collection collection={collection} />
                )}
                {!collection.name && (<div></div>)}
                <DeleteCard deleteFunc={deleteFunc} id={id} />
            </div>
        </div>
    )
}

export default Card
