import React from 'react'

import styles from '../styles/footer.module.css'

const Footer = () => {

    return (
        <div className={styles.container}>
            <ul>
                <a href="mailto:debabrata.js@protonmail.com"><li>Report a bug</li></a>
                <a href="mailto:debabrata.js@protonmail.com"><li>Contact</li></a>
            </ul>
        </div>
    )
}

export default Footer
