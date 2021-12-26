import {useState} from 'react';
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import styles from "../../styles/markdown.module.css"

const MarkdownHelp = () => {

    // Modal state
    const [open, setOpen] = useState(false)

    // Popup styling
    const contentStyle = { 
        width: "80%",
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        display: "block",
        overflow: "auto",
        padding: '20px'
    };
    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    return (
        <div className={styles.wrapper}>
            <button 
                onClick={() => setOpen(true)}
                className={styles.btn}>
                Markdown Help
            </button>

            <Popup 
                className="modal" 
                open={open} 
                closeOnDocumentClick closeOnEscape 
                onClose={() => setOpen(false)}
                overlayStyle={overlayStyle}
                contentStyle={contentStyle}>
                <div className={styles.container}>
                    <div className={styles.flex}>
                        <p>Heading</p>
                        <div className={styles.syntax}>
                            <p># H1</p>
                            <p># H2</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Bold</p>
                        <div className={styles.syntax}>
                            <p>**bold**</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Italic</p>
                        <div className={styles.syntax}>
                            <p>*italic*</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Ordered List</p>
                        <div className={styles.syntax}>
                            <p>1. List item 1</p>
                            <p>2. List item 2</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Unordered List</p>
                        <div className={styles.syntax}>
                            <p>- List item 1</p>
                            <p>- List item 2</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Code</p>
                        <div className={styles.syntax}>
                            <p>`code`</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Horizontal Rule</p>
                        <div className={styles.syntax}>
                            <p>---</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Link</p>
                        <div className={styles.syntax}>
                            <p>[title](https://www.example.com)</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Image</p>
                        <div className={styles.syntax}>
                            <p>![alt text](image.jpg)</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Blockquote</p>
                        <div className={styles.syntax}>
                            <p>{">"} blockquote</p>
                        </div>
                    </div>
                    <div className={styles.flex}>
                        <p>Footnote</p>
                        <div className={styles.syntax}>
                            <p>Sentence with a footnote. [^1]</p>
                            <p>[^1]: The footnote</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setOpen(false)}
                        className={styles.closeBtn}
                    >
                        Close
                    </button>
                </div>
            </Popup>
        </div>
    )
}

export default MarkdownHelp
