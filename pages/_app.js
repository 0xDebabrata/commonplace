import { useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Head from "next/head"
import { Toaster } from "react-hot-toast";

import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  }

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <>
      <Head>
        <title>Commonplace</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@0xCommonplace" />
        <meta name="twitter:creator" content="@0xDebabrata" />
        <meta name="twitter:title" content="Commonplace - An autobiography of the mind" />
        <meta name="twitter:description" content="Commonplace gives you a place to collect your thoughts while reading and a tool to look back on them in the future." />
        <meta name="twitter:image" content="https://www.commonplace.one/twitter-card-home.png" />
        <meta name="twitter:image:alt" content="Twitter card for commonplace.one" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://cdn.splitbee.io/sb.js"></script>
      </Head>
      <SessionContextProvider 
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Banner />
        <Navbar />
        <Component {...pageProps} />
        <Footer />
        <Toaster />
      </SessionContextProvider>
    </>
  );
}

export default MyApp;
