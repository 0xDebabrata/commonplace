import { UserContext } from '../utils/context'
import { useUserData } from '../utils/hooks'

import Navbar from '../components/Navbar'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

    const userData = useUserData()

    return (
        <UserContext.Provider value={ userData }>
            <Navbar />
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
