import React from 'react'
import Link from 'next/link'

import styles from '../styles/newCardButton.module.css'

const NewCardButton = () => {
    
    return (
        <div className={styles.container}>
            <Link href='/new'>
                <img 
                    src="/plus-icon.svg" 
                    alt="New card icon" 
                    width={40}
                    height={40} />
            </Link>
        </div>
    )
}

export default NewCardButton
