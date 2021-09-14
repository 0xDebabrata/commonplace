import React from "react"

import styles from "../styles/tagPage.module.css"

const TagHeader = ({ tagColour, tagName }) => {

    return (
        <div className={styles.wrapper}>
            <h2 
                className={styles.header}
            >
                Tag
                <span
                    className={styles.tag}
                    style={{
                        color: `#${tagColour}`
                    }}>
                    {tagName}
                </span>
            </h2>
            <div>
                <img
                    src="/edit-icon.svg"
                    alt="edit tag"
                />
                <img
                    src="/delete-icon.svg"
                    alt="delete tag"
                />
            </div>
        </div>
    )
}

export default TagHeader
