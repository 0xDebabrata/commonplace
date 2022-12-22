import React, { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import Search from "./Search";

import styles from "../styles/navbar.module.css";
import { useViewportWidth } from "../utils/hooks";

const Navbar = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient()
  const router = useRouter();
  const [width, setWidth] = useState(1920);
  const [isOpen, setIsOpen] = useState(false);

  const signIn = async () => {
    router.push("/signin");
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      router.push("/");
    }
  };

  const variants = {
    open: { opacity: 1, y: 50, height: 130 },
    closed: { opacity: 0, y: 50, height: 0 },
  };

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width <= 500) {
    return (
      <nav className="flex justify-between mx-10 bg-neutral-800">
        <Link href="/">
          <h1 className={styles.navLogo}>commonplace</h1>
        </Link>

        {!user && (
          <>
            <ul>
              <li onClick={() => setIsOpen(!isOpen)} className={styles.menu}>
                <Image src={"/menu-icon.svg"} width={30} height={30} />
              </li>
              <li>
                <button onClick={signIn} className={styles.signInBtn}>
                  Sign In
                </button>
              </li>
            </ul>
            <motion.ul
              animate={isOpen ? "open" : "closed"}
              variants={variants}
              className={styles.mobileNav}
            >
              {isOpen && (
                <li onClick={() => setIsOpen(!isOpen)}>
                  <Link href="/blog">Blog</Link>
                </li>
              )}
              {isOpen && (
                <li onClick={() => setIsOpen(!isOpen)}>
                  <Link href="/pricing">Pricing</Link>
                </li>
              )}
            </motion.ul>
          </>
        )}

        {user && (
          <div className={styles.wrapper}>
            {/*
                        <Search />
                        */}
            <button onClick={signOut} className={styles.signOutBtn}>
              Sign out
            </button>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex justify-between py-3 px-16 bg-neutral-800">
      <Link href="/">
        <h1 className={styles.navLogo}>commonplace</h1>
      </Link>

      {!user && (
        <ul>
          <Link href="/blog">
            <li>Blog</li>
          </Link>
          <Link href="/pricing">
            <li>Pricing</li>
          </Link>
          <li>
            <button onClick={signIn} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
              Sign In
            </button>
          </li>
        </ul>
      )}

      {user && (
        <div className={styles.wrapper}>
          <Search />
          <button onClick={signOut} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
