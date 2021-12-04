import React, { forwardRef } from 'react'

import Excerpt from '../new/Excerpt'
import Note from '../new/Note'
import DisplayTags from './DisplayTags'
import Collection from './Collection'
import DisplayDate from './Date'
import DeleteCard from './Delete'

import styles from '../../styles/card.module.css'

const Card = forwardRef(({ excerpt, note, tags, collection, date, deleteFunc, id, ref }) => {

    return (
        <div className={styles.container}>
            <DisplayDate date={date} />
            <Excerpt excerpt={excerpt} />
            <div className={styles.tagsContainer}>
                <DisplayTags tags={tags} />
            </div>
            <Note note={note} />
            <div className={styles.wrapper}>
                {collection && (<Collection collection={collection} />
                )}
                {!collection && (<div></div>)}
                <DeleteCard ref={ref} deleteFunc={deleteFunc} id={id} />
            </div>
        </div>
    )
})

export default Card
