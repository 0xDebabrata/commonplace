import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import splitbee from "@splitbee/web";


const One = () => {
  const router = useRouter()

  const signIn = async () => {
    router.push("/signin")
    splitbee.track("Sign up")
  };

  return (
    <div className="bg-neutral-800 text-center pb-32 text-white">
      <Image src="/Logo.png" 
        className="mx-auto pt-7 md:pt-10"
        alt="Commonplace logo"
        width={320} height={320}
        />

      <h1 className="text-5xl mt-3">
        Save articles and tweets for easy access
      </h1>
      <h3 className="text-2xl max-w-3xl mt-6 px-5 mx-auto text-slate-300">
        Commonplace automatically organizes your information and has a powerful search built-in
      </h3>

      <button onClick={signIn} className="py-2 px-10 mt-8 bg-neutral-600 rounded cursor-pointer transition-all hover:bg-neutral-500">
        Grow your information library
      </button>
    </div>
  )
};

export default One;
