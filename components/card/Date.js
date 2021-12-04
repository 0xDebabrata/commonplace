import React from 'react'

import styles from '../../styles/card.module.css'

const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const DisplayDate = ({ date }) => {

    var newdate = new Date(date)

    const dateStr = `${day[newdate.getDay()]}, ${month[newdate.getMonth()]} ${newdate.getDate()}, ${newdate.getFullYear()}`

    return (
        <p className={styles.date}>
            {dateStr}
        </p>
    )
}

export default DisplayDate 
