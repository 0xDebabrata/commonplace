import React from 'react'
import Image from 'next/image'

import styles from '../../styles/Homepage.module.css'

const Two = () => {
    return (
        <div id="learn-more" className={styles.containerTwo} >
            <h2 className={styles.title}>The Commonplace Book Method</h2>
            <div className={styles.wrapperTwo}>
                <p>A commonplace book is a place for you to gather, organize, store, and display the ideas, quotes, observations, stories—anything at all—that you need or want to refer to in the future.</p>
                <Image
                    src="/journal.png"
                    alt="commonplace book"
                    width={490}
                    height={491}
                />
            </div>
            <p>It's like an ongoing journal where you collect the best of yourself—something that can be turned to time after time when you're looking for inspiration or just want to enjoy the things you've found.</p>
        </div>
    )
}

export default Two 
