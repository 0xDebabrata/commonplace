import styles from "../../styles/sidebar.module.css"

const ExcerptPreview = ({ data }) => {

  return (
    <div className={styles.wrapper}>
      <a href={`#${data.id}`}>
        {data.excerpt}
      </a>
    </div>
  )
}

export default ExcerptPreview
