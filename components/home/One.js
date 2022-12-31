import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";


const One = () => {
  const router = useRouter()

  const signIn = async () => {
    router.push("/signin")
  };

  return (
    <div className="bg-neutral-800 text-center pb-32 text-white">
      <Image src="/Logo.png" 
        className="mx-auto pt-7 md:pt-16"
        alt="Commonplace logo"
        width={350} height={350}
        />

      <h1 className="text-5xl mt-2">
        Your information, organized.
      </h1>
      <h3 className="text-2xl max-w-3xl mt-6 px-5 mx-auto text-slate-300">
        Capture information and remember what matters to you the most.<br />
        With a powerful search built-in, your information is never lost.
      </h3>

      <button onClick={signIn} className="py-2 px-10 mt-8 bg-neutral-600 rounded cursor-pointer transition-all hover:bg-neutral-500">
        Get early access
      </button>
      <p className="text-sm text-slate-400 mt-2">
        Twitter integration live!
      </p>
    </div>
  )
};

export default One;
