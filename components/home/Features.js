import Feature from "./Feature"

import styles from "../../styles/features.module.css"

export default function Features() {
    return (
        <div id="learn-more" className={styles.container}>
            <Feature
                icon={copy.note.icon}
                title={copy.note.title}
                desc={copy.note.desc}
                alt={copy.note.alt}
            />
            <Feature
                icon={copy.organise.icon}
                title={copy.organise.title}
                desc={copy.organise.desc}
                alt={copy.organise.alt}
            />
            <Feature
                icon={copy.search.icon}
                title={copy.search.title}
                desc={copy.search.desc}
                alt={copy.search.alt}
            />
            <Feature
                icon={copy.markdown.icon}
                title={copy.markdown.title}
                desc={copy.markdown.desc}
                alt={copy.markdown.alt}
            />
        </div>
    )
}

const copy = {
    note: {
        icon: "/edit-icon-feature.svg",
        title: "Take notes",
        desc: "Instead of highlighting whatever you read, take notes. That's the way people learn. Commonplace makes it easy to do just that.",
        alt: "Pencil icon"
    },
    organise: {
        icon: "/tag-icon-feature.svg",
        title: "Organise",
        desc: "Use tags and collections to organise your notes in one seamless experience across all your devices.",
        alt: "Tag icon"
    },
    search: {
        icon: "/search-icon-feature.svg",
        title: "Search",
        desc: "Search across all your notes and get relevant results quickly. Discover what you've written before in less time!",
        alt: "Search icon"
    },
    markdown: {
        icon: "/markdown-icon-feature.svg",
        title: "Markdown support",
        desc: "With markdown, you have a more powerful tool to express your thoughts while noting down things that resonate with you.",
        alt: "Bulb icon"
    }
}
