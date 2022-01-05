import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Image from "next/image"

import styles from "../../styles/blog.module.css"

const PostPage = ({ frontMatter: { title, thumbnailUrl }, mdxSource }) => {
    return (
        <div className={styles.postContainer}>
            <div className={styles.postImg}>
                <Image src={thumbnailUrl}
                    width={960}
                    height={540}
                />
            </div>
            <div className={styles.content}>
                <h1>{title}</h1>
                <MDXRemote {...mdxSource} />
            </div>
        </div>
    )
}

export default PostPage

export const getStaticPaths = async () => {
    const files = fs.readdirSync(path.join("posts"))
    const paths = files.map(filename => (
        {
            params: {
                slug: filename.replace(".mdx", "")
            }
        }
    ))

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async ({ params: { slug }}) => {
    const markdownWithMeta = fs.readFileSync(path.join("posts", slug + ".mdx"), "utf-8")
    const { data: frontMatter, content } = matter(markdownWithMeta)
    const mdxSource = await serialize(content)

    return {
        props: {
            frontMatter,
            slug,
            mdxSource
        }
    }
}
