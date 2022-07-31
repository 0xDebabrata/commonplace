import React from "react";
import Image from "next/image";

import styles from "../../styles/Homepage.module.css";

const Two = () => {
  return (
    <div className={styles.containerTwo}>
      <h2 className={styles.title}>Build a private library of information</h2>
      <div className={styles.wrapperTwo}>
        <p>
          Commonplace is a place for you to gather, organize, store, and display
          the ideas, quotes, observations, stories—anything at all—that you need
          or want to refer to in the future.
        </p>
        <Image
          src="/journal.png"
          alt="commonplace book"
          width={490}
          height={491}
        />
      </div>
      <p>
        It gives you the power to act on the knowledge you gain from books and
        other sources and to reflect on it. You can open your Commonplace
        collection after reading a book and see which quotes, diagrams or facts
        have stuck out for you.
        <br />
        <br />
        This way, you'll build up a private database of what's important to you.
      </p>
    </div>
  );
};

export default Two;
