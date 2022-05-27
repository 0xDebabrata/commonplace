import { motion } from "framer-motion"

import ExcerptPreview from "./ExcerptPreview"

import styles from "../../styles/sidebar.module.css"

const Sidebar = ({ excerptArr }) => {

  return (
    <div className={styles.container}>
      <motion.aside>
        <div className={styles.main}>
          {excerptArr.map(data => (
            <ExcerptPreview key={data.id} data={data} />
          ))}
        </div>
      </motion.aside>
    </div>
  )
}

export default Sidebar
