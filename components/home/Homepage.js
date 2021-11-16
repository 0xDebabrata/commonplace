import React from 'react'
import One from './One'
import Two from './Two'
import Three from './Three'

import styles from '../../styles/Homepage.module.css'

const Homepage = () => {

    return (
        <div className={styles.container} >
            <One />
            <Two />
            <Three />
        </div>
    )
}

export default Homepage 
