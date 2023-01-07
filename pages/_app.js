import { useEffect, useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Head from "next/head"
import { Toaster } from "react-hot-toast";
import splitbee from "@splitbee/web";
import localFont from "@next/font/local"
import { Hanken_Grotesk } from "@next/font/google"

//import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/globals.css";

const satoshi = localFont({ 
  src: "../font/Satoshi-Variable.ttf",
  variable: "--font-satoshi"
})

function MyApp({ Component, pageProps }) {
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  }

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    splitbee.init({
      scriptUrl: "/bee.js",
      apiUrl: "/_hive",
    })
  }, [])

  return (
    <>
      <Head>
        <title>Commonplace</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@0xCommonplace" />
        <meta name="twitter:creator" content="@0xDebabrata" />
        <meta name="twitter:title" content="Commonplace: Your information, organized" />
        <meta name="twitter:description" content="Organize information and build your personal information library" />
        <meta name="twitter:image" content="https://www.commonplace.one/twitter-card-home.png" />
        <meta name="twitter:image:alt" content="Twitter card for commonplace.one" />
      </Head>
      <SessionContextProvider 
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <div className={`${satoshi.variable} font-sans`}>
          {/*
<Banner />
*/}
          <Navbar />
          <Component {...pageProps} />
          <Footer />
          <Toaster />
        </div>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;

export const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"] })

