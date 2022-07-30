import styles from "../styles/support.module.css"

export default function Support() {
  return (
    <div className={styles.container}>
      <h1>We'd love to hear from you!</h1>
      <p>
        Send us an email with any feedback, suggestion or complaint.
      </p>

      <div className={styles.wrapper}>
        <a href="mailto:hello@commonpalce.one">hello@commonplace.one</a>
        <p>+91 7439901282</p>
        <p>
          Commonplace<br />
          S-7/7, Srabani Abasan<br />
          FC Block, Sec-3, Salt Lake<br />
          Kolkata - 700 106<br />
          West Bengal<br />
          India
        </p>
      </div>
    </div>
  )
}
