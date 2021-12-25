import Shortcuts from "./keyboard-shortcuts/Shortcuts"

import styles from '../styles/footer.module.css'

const Footer = () => {
    return (
        <div className={styles.container}>
            <Shortcuts />
            <ul>
                <a href="mailto:dev@commonplace.one"><li>Report a bug</li></a>
                <a href="mailto:hello@commonplace.one"><li>Contact</li></a>
            </ul>
        </div>
    )
}

export default Footer
