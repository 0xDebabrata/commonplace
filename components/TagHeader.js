import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react"

import DeleteModal from "./DeleteModal";
import EditTagModal from "./EditTagModal";

import styles from "../styles/tagPage.module.css";

const TagHeader = ({ tagColour, tagName, allowDelete, id, router }) => {
  const supabaseClient = useSupabaseClient()

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = (id, router) => {
    // Delete tag
    const deleteFunc = async (id, router) => {
      const { error } = await supabaseClient.from("tags").delete().eq("id", id);

      if (error) throw error;
      router.push("/");
    };

    const promise = deleteFunc(id, router);
    toast.promise(
      promise,
      {
        loading: "Deleting tag",
        success: "Tag deleted",
        error: (err) => {
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
        success: {
          icon: "🗑",
        },
      }
    );
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>
        Tag
        <span
          className={styles.tag}
          style={{
            color: `#${tagColour}`,
          }}
        >
          {tagName}
        </span>
      </h2>
      <div>
        <img
          onClick={() => setEditOpen(true)}
          src="/edit-icon.svg"
          alt="edit tag"
        />
        <EditTagModal
          id={id}
          router={router}
          open={editOpen}
          setOpen={setEditOpen}
          tagName={tagName}
          tagColour={tagColour}
        />

        {/* Allow tag to be deleted if it does not have any card associated with it */}
        {allowDelete && (
          <>
            <img
              onClick={() => setOpen(true)}
              src="/delete-icon.svg"
              alt="delete tag"
            />
            <DeleteModal
              type="tag"
              open={open}
              setOpen={setOpen}
              handleDelete={handleDelete}
              id={id}
              router={router}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TagHeader;
