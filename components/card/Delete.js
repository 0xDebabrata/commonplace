import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import DeleteModal from '../DeleteModal'

import styles from '../../styles/card.module.css'

const DeleteCard = forwardRef(({ id, deleteFunc }, ref) => {

    const router = useRouter()

    // Modal state
    const [open, setOpen] = useState(false)

    const handleDelete = (id, router) => {
        const promise = deleteFunc(id, router)
        toast.promise(promise, {
            loading: "Deleting card",
            success: "Card deleted", 
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

    useImperativeHandle(ref, () => ({
        openDeleteModal() {
            setOpen(true)
        }
    }))

    return(
        <div className={styles.deleteContainer} >
            <img 
                onClick={() => router.push(`/edit?id=${id}`)}
                src="/edit-icon.svg" 
                alt="edit card icon" 
            />
            <img 
                onClick={() => setOpen(true)}
                src="/delete-icon.svg" 
                alt="delete card icon" />

            <DeleteModal
                type="card"
                open={open}
                setOpen={setOpen}
                handleDelete={handleDelete}
                id={id}
                router={router}
            />
        </div>
    )
})

export default DeleteCard
