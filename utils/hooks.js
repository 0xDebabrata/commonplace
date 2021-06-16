import { useState, useEffect } from 'react'
import supabase from './supabaseClient'

// Custom hook to return logged in user data
export function useUserData() {

    // Set logged in user
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Update user on auth state change
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async () => checkUser()
        )

        // Check whether user is logged in and update state accordingly
        checkUser()
        
        return () => {
            authListener?.unsubscribe()
        }

    }, [])
        
    // Check user presence and update state
    const checkUser = async () => {
        const user = supabase.auth.user()
        setUser(user)
    }

    return { user }

}
