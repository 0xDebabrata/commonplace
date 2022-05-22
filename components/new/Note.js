import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

import styles from "../../styles/note.module.css";

const Note = ({ note }) => {
  const parseMd = () => {
    const raw = marked(note);

    // Hook to open links in new tab
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if ("target" in node) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener");
      }
      if (
        !node.hasAttribute("target") &&
        (node.hasAttribute("xlink:href") || node.hasAttribute("href"))
      ) {
        node.setAttribute("xlink:show", "new");
      }
    });

    const clean = DOMPurify.sanitize(raw);
    return clean;
  };

  if (!note) return null;

  return (
    <div
      id="card-container"
      dangerouslySetInnerHTML={{ __html: parseMd() }}
      className={styles.container}
    ></div>
  );
};

export default Note;
