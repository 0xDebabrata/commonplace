import Key from "./Key"
import styles from "../../styles/shortcuts.module.css"

const Search = () => {
    return (
        <div className={styles.shortcut}>
            <div className={styles.keys}>
                <Key keyboard="⌘" width={"33"} />
                <span style={{padding: "0 5px"}}>/</span>
                <Key keyboard="Ctrl" width={"50"} />
                <span style={{padding: "0 5px"}}>+</span>
                <Key keyboard="K" width={"33"} />
            </div>
            <div className={styles.desc}>
                Full text search
            </div>
        </div>
    )
}

export default Search 
