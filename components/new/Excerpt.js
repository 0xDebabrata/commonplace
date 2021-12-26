import React from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

import styles from '../../styles/excerpt.module.css'

const Excerpt = ({ excerpt }) => {

    const parseMd = () => {
        const raw = marked(excerpt)

        // Hook to open links in new tab
        DOMPurify.addHook("afterSanitizeAttributes", (node) => {
            if ("target" in node) {
                node.setAttribute("target", "_blank")
                node.setAttribute("rel", "noopener")
            }
            if (!node.hasAttribute('target') && (node.hasAttribute('xlink:href') || node.hasAttribute('href'))) {
                 node.setAttribute('xlink:show', 'new');
            }
        })

        const clean = DOMPurify.sanitize(raw)
        return clean
    }

    return (
        <div id="excerpt-container" className={styles.container}>
            <div 
                dangerouslySetInnerHTML={{__html: parseMd()}}
                className={styles.wrapper}>
            </div>
        </div>
    )
}

export default Excerpt
