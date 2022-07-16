import { UserProvider } from "@supabase/auth-helpers-react"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { UserContext } from "../utils/context";
import { useUserData } from "../utils/hooks";

import { Toaster } from "react-hot-toast";

import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserProvider supabaseClient={supabaseClient}>
      <UserContext.Provider value={userData}>
        <Banner />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <Toaster />
      </UserContext.Provider>
    </UserProvider>
  );
}

export default MyApp;
