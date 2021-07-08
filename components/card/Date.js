import React from 'react'

import styles from '../../styles/card.module.css'

const DisplayDate = ({ date }) => {

    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: false
    }

    var newdate = new Date(date)

    return (
        <p className={styles.date}>
            {newdate.toLocaleTimeString("en-us", options).substring(0, 16)}
        </p>
    )
}

export default DisplayDate 
