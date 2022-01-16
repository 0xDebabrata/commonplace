import Image from "next/image"
import styles from "../../styles/features.module.css"

export default function Feature({ icon, title, desc, alt }) {
    return (
        <div className={styles.box}>
            <div className={styles.img}>
                <Image src={icon} width={28} height={28} alt={alt} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )
}
