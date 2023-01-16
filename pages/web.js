import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { hankenGrotesk } from "./_app";
import { IconContext } from "react-icons"
import { BiArrowBack } from "react-icons/bi"
import splitbee from "@splitbee/web"; 

const Web = () => {
  const router = useRouter();
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState("")
  const [cards, setCards] = useState([])

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-[800px] text-center px-10">
        <h2 className="text-white text-2xl pt-10">Save articles from the web</h2>
        <input
          className="text-white w-full mt-3 py-1 px-4 rounded bg-neutral-700 border border-neutral-700 focus:outline-none focus:border-neutral-500"
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder='Enter link to article: http://www.paulgraham.com/newideas.html'
          value={url}
          />
        <div className="flex m-5 mx-auto justify-end">
          <button className="bg-neutral-800 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Summarize
          </button>
          <button className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Save
          </button>
        </div>
      </div>

      {loading && (
        <span class="mt-5 flex h-1 w-full">
          <span class="animate-pulse h-[3px] w-full rounded-full bg-zinc-600"></span>
        </span>
      )}

    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      }
    }
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    }
  }
}

export default Web;

