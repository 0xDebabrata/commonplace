import { UserProvider } from "@supabase/auth-helpers-react"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import Head from "next/head"
import { Toaster } from "react-hot-toast";

import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Commonplace</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@0xCommonplace" />
        <meta name="twitter:creator" content="@0xDebabrata" />
        <meta name="twitter:title" content="Commonplace - An autobiography of the mind" />
        <meta name="twitter:description" content="Commonplace gives you a place to collect your thoughts while reading and a tool to look back on them in the future." />
        <meta name="twitter:image" content="https://commonplace.one/twitter-card-home.png" />
        <meta name="twitter:image:alt" content="Twitter card for commonplace.one" />
      </Head>
      <UserProvider supabaseClient={supabaseClient}>
        <Banner />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <Toaster />
      </UserProvider>
    </>
  );
}

export default MyApp;
