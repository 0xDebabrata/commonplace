import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient()
  const router = useRouter();

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

  return (
    <nav className="flex justify-between py-3 px-10 md:px-16 bg-neutral-800">
      <Link className="flex items-center" href="/">
        <Image src="/Logo.png" 
          alt="Commonplace logo"
          width={32} height={32}
          />

        <h1 className="ml-4 text-2xl text-white">Commonplace</h1>
      </Link>

      {!user && (
        <ul>
          {/*
          <Link href="/pricing">
            <li>Pricing</li>
          </Link>
          */}
          <li>
            <button onClick={signIn} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
              Sign In
            </button>
          </li>
        </ul>
      )}

      {user && (
        <div className={styles.wrapper}>
          <button onClick={signOut} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
