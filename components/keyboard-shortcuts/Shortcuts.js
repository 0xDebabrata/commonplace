import { useState } from "react"
import Popup from 'reactjs-popup';
import Search from "./Search"
import NewCard from "./NewCard"
import SaveCard from "./SaveCard"
import View from "./View"

import { useKeyPress } from "../../utils/hooks"

import styles from '../../styles/shortcuts.module.css'
import 'reactjs-popup/dist/index.css';

const Shortcuts = () => {

    const [open, setOpen] = useState(false)

    useKeyPress(["V"], () => setOpen(!open))

    // Popup styling
    const contentStyle = { 
        width: "70%",
        maxWidth: "500px",
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        padding: '20px 50px 40px 50px'
    };

    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    return (
        <>
            <p
                className={styles.footerText}
                onClick={() => setOpen(true)}>
                Shortcuts
            </p>
            <Popup 
                className="modal" 
                open={open} 
                closeOnDocumentClick closeOnEscape 
                onClose={() => {
                    setOpen(false)
                }}
                overlayStyle={overlayStyle}
                contentStyle={contentStyle}
            >
                <h2>Keyboard Shortcuts</h2>

                <Search />
                <NewCard />
                <SaveCard />
                <View />

                <button
                    className={styles.cancelBtn}
                    onClick={() => setOpen(false)}
                >
                    Close
                </button>
            </Popup>
        </>
    )
}

export default Shortcuts
