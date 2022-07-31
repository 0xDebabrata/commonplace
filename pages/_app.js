import { UserProvider } from "@supabase/auth-helpers-react"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"

import { Toaster } from "react-hot-toast";

import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Banner />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Toaster />
    </UserProvider>
  );
}

export default MyApp;
