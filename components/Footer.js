import Shortcuts from "./keyboard-shortcuts/Shortcuts"
import Export from "./export/"

import styles from '../styles/footer.module.css'

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Shortcuts />
        <Export />
      </div>

      <ul>
        <a href="mailto:dev@commonplace.one"><li>Report a bug</li></a>
        <a href="mailto:hello@commonplace.one"><li>Contact</li></a>
      </ul>
    </div>
  )
}

export default Footer
