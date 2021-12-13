import styles from '../../styles/shortcuts.module.css'

const Key = ({ keyboard, width }) => {

    const keyStyle = {
        height: "33px",
        width: `${width}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(196, 196, 196, 0) 30.21%, rgba(176, 176, 167, 0.33) 100%)",
        border: "1px solid #626262",
        borderRadius: "7px"
    }

    return (
        <div style={keyStyle} className={styles.key}>
            <p>{keyboard}</p>
        </div>
    )
}

export default Key 

