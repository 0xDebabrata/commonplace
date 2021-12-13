import Key from "./Key"
import styles from "../../styles/shortcuts.module.css"

const SaveCard = () => {
    return (
        <div className={styles.shortcut}>
            <div className={styles.keys}>
                <Key keyboard="Shift" width={"66"} />
                <span style={{padding: "0 5px"}}>+</span>
                <Key keyboard="S" width={"33"} />
            </div>
            <div className={styles.desc}>
                Save card
            </div>
        </div>
    )
}

export default SaveCard 

