import React, { useState } from "react"
import DeleteModal from './DeleteModal'
import toast from "react-hot-toast"
import supabase from "../utils/supabaseClient"

import styles from "../styles/tagPage.module.css"

const TagHeader = ({ tagColour, tagName, allowDelete, id, router }) => {

    const [open, setOpen] = useState(false)


    const handleDelete = (id, router) => {

        // Delete tag
        const deleteFunc = async (id, router) => {
            const { data, error } = await supabase
                .from("tags")
                .delete()
                .eq("id", id)

            if (error) throw error;

            router.push("/")
        }

        const promise = deleteFunc(id, router)
        toast.promise(promise, {
            loading: "Deleting tag",
            success: "Tag deleted", 
            error: err => {
                return `${err}`
            } 
        },
        {
            style: {
                background: "rgba(105,105,105,0.7)",
                minWidth: "300px",
                color: "white",
                backdropFilter: "blur(10px)"
            },
            success: {
                icon: "🗑"
            }
        })
    }

    return (
        <div className={styles.wrapper}>
            <h2 
                className={styles.header}
            >
                Tag
                <span
                    className={styles.tag}
                    style={{
                        color: `#${tagColour}`
                    }}>
                    {tagName}
                </span>
            </h2>
            <div>
                <img
                    src="/edit-icon.svg"
                    alt="edit tag"
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
    )
}

export default TagHeader
