import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import toast from "react-hot-toast";

export default function SignIn() {
  const supabaseClient = useSupabaseClient()
  const [email, setEmail] = useState("");

  const handleSignin = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}`,
      }
    })
  }

  const handleEmailSignin = async () => {
    await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}`,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = handleEmailSignin();
    toast.promise(
      promise,
      {
        loading: "Sending email",
        success: "Please check your email for login link",
        error: (err) => {
          console.log(err);
          return "There was an error";
        },
      },
      {
        style: {
          minWidth: "400px",
        },
        success: { duration: 4000 },
      }
    );
  };

  return (
    <div className="bg-neutral-800 h-[calc(100vh-89px)] flex flex-col justify-center items-center">
      <button className="py-2 px-10 w-[280px] bg-neutral-700 border border-neutral-600 flex justify-center items-center rounded text-white -translate-y-8" onClick={handleSignin}>
        <img src="/google-icon.svg" alt="Google icon" height={24} width={24} className="mr-4" />
        Sign in with Google
      </button>
      <form onSubmit={handleSubmit} className="w-[280px] mt-4 -translate-y-8">
        <input
          className="w-full py-2 px-5 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-neutral-600"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Or use email instead"
          />
      </form>
    </div>
  )
}
