import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../utils/context'
import supabase from '../utils/supabaseClient'
import { useRouter } from 'next/router'

import Loader from './Loader'
import SignIn from './Signin'

const ProtectedRoute = ({ children }) => {

    const { user } = useContext(UserContext)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const getCustId = async () => {
        const { data: users } = await supabase
            .from("users")
            .select("customer_id")

        if (!users[0].customer_id) {
            router.push("/")
        } else {
            localStorage.setItem(`${user.id}-customer_id`, users[0].customer_id)
        }

        setLoading(false)
    }

    useEffect(() => {
        if (user) {
            if (!localStorage.getItem(`${user.id}-customer_id`)) {
                getCustId()
            } else {
                setLoading(false)
            }
        }
    }, [user])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {user && (
                children
            )}

            {!user && (
                <SignIn />
            )}
        </>
    )
}

export default ProtectedRoute
