import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../utils/context'

const ProtectedRoute = ({ children }) => {

    const router = useRouter()
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (!user) {
            router.push("/")
        }
    })

    if (user) {
        return children
    } else {
        return <p>Loading</p>
    }
}

export default ProtectedRoute
