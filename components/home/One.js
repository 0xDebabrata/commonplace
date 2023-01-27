import React from "react";
import { useRouter } from "next/router";
import splitbee from "@splitbee/web";


const One = () => {
  const router = useRouter()

  const signIn = async () => {
    router.push("/signin")
    splitbee.track("Sign up")
  };

  return (
    <div className="bg-neutral-800 text-center pb-10 text-white">
      <h1 className="text-5xl pt-32 leading-tight">
        Save articles and tweets.<br />
        Find what you need, faster.
      </h1>
      <h3 className="text-2xl max-w-3xl mt-6 px-5 mx-auto text-slate-300">
        With auto organization and a powerful search your information is never lost.
      </h3>

      <button onClick={signIn} className="py-2 px-10 mt-8 bg-neutral-600 rounded cursor-pointer transition-all hover:bg-neutral-500">
        Grow your information library
      </button>
    </div>
  )
};

export default One;
