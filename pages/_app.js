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
import { SidebarContext } from "../utils/sidebarContext";

import "../styles/globals.css";
import Sidebar from "../components/sidebar";

const satoshi = localFont({ 
  src: "../font/Satoshi-Variable.ttf",
  variable: "--font-satoshi"
})

function MyApp({ Component, pageProps }) {
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  }

  const updateSidebar = (val) => {
    setSidebarDetails({
      open: val.open,
      details: val.details,
      updateSidebar
    })
  }

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const [sidebarDetails, setSidebarDetails] = useState({
    open: false,
    details: {},
    updateSidebar
  })

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
          <SidebarContext.Provider value={sidebarDetails}>
            <Component {...pageProps} />
          </SidebarContext.Provider>
          <Sidebar sidebarDetails={sidebarDetails} />
          <Footer />
          <Toaster />
        </div>
      </SessionContextProvider>
    </>
  );
}

export default MyApp;

export const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"] })

