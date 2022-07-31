import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getUser, withPageAuth, supabaseClient } from "@supabase/auth-helpers-nextjs"

import { useKeyPress } from "../utils/hooks";

import { createCard } from "../functions/new";

import EditingView from "../components/new/EditingView";
import PreviewCard from "../components/new/PreviewCard";
import styles from "../styles/new.module.css";

export default function New({ user }) {
  const router = useRouter();

  const [excerpt, setExcerpt] = useState("");
  const [note, setNote] = useState("");

  // Loading user's tags and collections from DB
  const [tagsLoading, setTagsLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // User's tags and collections
  const [userTags, setUserTags] = useState(null);
  const [userCollections, setUserCollections] = useState(null);

  // Current tags and collection
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Set keyboard shortcuts
  useKeyPress(["S"], () => handleKeyPress());

  const handleKeyPress = () => {
    const textarea = document.getElementsByTagName("textarea");
    const inputs = document.getElementsByTagName("input");
    const textareaArr = Array.from(textarea);
    const inputArr = Array.from(inputs);

    if (
      !inputArr.includes(document.activeElement) &&
      !textareaArr.includes(document.activeElement)
    ) {
      handleCreateCard();
    }
  };

  const handleExcerptChange = () => {
    const excerptVal = document.getElementsByTagName("textarea")[0].value;
    setExcerpt(excerptVal);
  };

  const handleNoteChange = () => {
    const noteVal = document.getElementsByTagName("textarea")[1].value;
    setNote(noteVal);
  };

  // Get user tags
  const getTags = async () => {
    let { data: tags, error } = await supabaseClient.from("tags").select("*");

    setUserTags(tags);
    setTagsLoading(false);
  };

  const getCollections = async () => {
    let { data: collections, error } = await supabaseClient
      .from("collections")
      .select("*");

    setUserCollections(collections);
    setCollectionsLoading(false);
  };

  useEffect(() => {
    getCollections();
    getTags();
  }, []);

  const handleCreateCard = () => {
    const collection = { name: title, author };
    const promise = createCard(
      excerpt,
      note,
      collection,
      userCollections,
      tags,
      userTags,
      user
    );
    toast.promise(
      promise,
      {
        loading: "Creating card",
        success: (data) => {
          router.push(`/card/${data}`);
          return "Card created";
        },
        error: (err) => {
          console.error(err)
          return `${err.message}`;
        },
      },
      {
        style: {
          background: "rgba(105,105,105,0.7)",
          minWidth: "300px",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <EditingView
        newCard={true}
        userTags={userTags}
        tags={tags}
        setTags={setTags}
        tagsLoading={tagsLoading}
        userCollections={userCollections}
        collectionsLoading={collectionsLoading}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        note={note}
        excerpt={excerpt}
        handleNoteChange={handleNoteChange}
        handleExcerptChange={handleExcerptChange}
      />

      <div className={styles.previewContainer}>
        <div className={styles.previewBox}>
          <h2 className={styles.header}>Preview</h2>
          <PreviewCard excerpt={excerpt} note={note} />
          <button
            className={styles.button}
            onClick={() => handleCreateCard()}
          >
            Create card
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({ 
  redirectTo: "/signin",
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    return { props: { user } };
  }
})
