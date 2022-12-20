import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import DeleteModal from "./DeleteModal";
import EditCollectionModal from "./EditCollectionModal";

import styles from "../styles/collectionPage.module.css";

const CollectionHeader = ({
  collectionName,
  collectionAuthor,
  allowDelete,
  id,
  router,
}) => {
  const supabaseClient = useSupabaseClient()

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = (id, router) => {
    // Delete tag
    const deleteFunc = async (id, router) => {
      const { error } = await supabaseClient
        .from("collections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      router.push("/");
    };

    const promise = deleteFunc(id, router);
    toast.promise(
      promise,
      {
        loading: "Deleting collection",
        success: "Collection deleted",
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
    <div className={styles.headerContainer}>
      <div className={styles.wrapper}>
        <h2 className={styles.header}>Collection</h2>
        <span>
          <h2 className={styles.name}>{collectionName}</h2>
          <h3 className={styles.author}>{collectionAuthor}</h3>
        </span>
      </div>

      <div>
        <img
          className={styles.edit}
          onClick={() => setEditOpen(true)}
          src="/edit-icon.svg"
          alt="edit tag"
        />
        <EditCollectionModal
          id={id}
          router={router}
          open={editOpen}
          setOpen={setEditOpen}
          collectionName={collectionName}
          collectionAuthor={collectionAuthor}
        />

        {/* Allow tag to be deleted if it does not have any card associated with it */}
        {allowDelete && (
          <>
            <img
              className={styles.delete}
              onClick={() => setOpen(true)}
              src="/delete-icon.svg"
              alt="delete tag"
            />
            <DeleteModal
              type="collection"
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

export default CollectionHeader;
