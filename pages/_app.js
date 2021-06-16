import { UserContext } from '../utils/context'
import { useUserData } from '../utils/hooks'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

    const userData = useUserData()

    return (
        <UserContext.Provider value={ userData }>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
