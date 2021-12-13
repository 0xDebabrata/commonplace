import Key from "./Key"
import styles from "../../styles/shortcuts.module.css"

const NewCard = () => {
    return (
        <div className={styles.shortcut}>
            <div className={styles.keys}>
                <Key keyboard="Shift" width={"66"} />
                <span style={{padding: "0 5px"}}>+</span>
                <Key keyboard="N" width={"33"} />
            </div>
            <div className={styles.desc}>
                Create new card
            </div>
        </div>
    )
}

export default NewCard 
