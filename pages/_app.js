import { UserContext } from '../utils/context'
import { useUserData } from '../utils/hooks'

import { Toaster } from 'react-hot-toast'

import Banner from "../components/Banner"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

    const userData = useUserData()

    return (
        <UserContext.Provider value={ userData }>
            <Banner />
            <Navbar />
            <Component {...pageProps} />
            <Footer />
            <Toaster />
        </UserContext.Provider>
    )
}

export default MyApp
