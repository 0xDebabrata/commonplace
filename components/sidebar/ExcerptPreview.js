import styles from "../../styles/sidebar.module.css"

const ExcerptPreview = ({ data }) => {

  return (
    <a className={styles.item} href={`#${data.id}`}>
      {data.excerpt}
    </a>
  )
}

export default ExcerptPreview
