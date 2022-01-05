import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import Image from "next/image"

import styles from "../../styles/blog.module.css"

const Blog = ({ posts }) => {
    return (
        <div className={styles.container}>
            <h1>Blog</h1>
            <div className={styles.posts}>
                {posts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} passHref key={index}>
                        <div className={styles.card}>
                            <div className={styles.wrapper}>
                                <h2>{post.frontMatter.title}</h2>
                                <p className={styles.date}>{post.frontMatter.data}</p>
                                <div className={styles.desc}>
                                    <p>{post.frontMatter.description}</p>
                                </div>
                            </div>
                            <div className={styles.img}>
                                <Image src={post.frontMatter.thumbnailUrl}
                                    width={384}
                                    height={216}
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const files = fs.readdirSync(path.join("posts"))
    const posts = files.map(filename => {
        const markdownWithMeta = fs.readFileSync(path.join("posts", filename), "utf-8")
        const { data: frontMatter } = matter(markdownWithMeta)

        return {
            frontMatter,
            slug: filename.split(".")[0]
        }
    })

    return {
        props: {
            posts
        }
    }
}

export default Blog
