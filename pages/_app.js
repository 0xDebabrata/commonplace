import '../styles/globals.css'
import UserContext from '../utils/context'

function MyApp({ Component, pageProps }) {
    return (
        <UserContext.Provider value={{ user: {} }}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
