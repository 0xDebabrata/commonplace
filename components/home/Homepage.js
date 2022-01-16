import React from 'react'
import One from './One'
import Two from './Two'
import Three from './Three'
import Features from "./Features"

import styles from '../../styles/Homepage.module.css'

const Homepage = () => {

    return (
        <div className={styles.container} >
            <One />
            <Features />
            <Two />
            <Three />
        </div>
    )
}

export default Homepage 
