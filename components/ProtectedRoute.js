import React, { useContext } from 'react'
import { UserContext } from '../utils/context'

import SignIn from './Signin'

const ProtectedRoute = ({ children }) => {

    const { user } = useContext(UserContext)

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
