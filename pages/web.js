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
  const [article, setArticle] = useState({})
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState("")
  const [cards, setCards] = useState([])

  const fetchArticle = async () => {
    setLoading(true)
    const { data } = await supabaseClient.functions.invoke('fetch-article', {
      body: {
        type: 'fetch',
        articleUrl: url
      }
    })
    setArticle({...data, articleUrl: url})

    if (!data) {

    }
    setLoading(false)
  }

  const fetchSummary = async () => {
    setLoading(true)
    const { data } = await supabaseClient.functions.invoke('fetch-article', {
      body: {
        type: 'summarize',
        articleUrl: url
      }
    })

    setArticle({...data.article, articleUrl: url})
    setSummary(data.data)
    setLoading(false)

    // Analytics
    splitbee.track("Article summary", {
      articleUrl: url,
      article: data.article,
      summary: data.data
    })
  }

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-[800px] text-center px-10">
        <h2 className="text-white text-2xl pt-10">Summarize articles from the web</h2>
        <input
          className="text-white w-full mt-3 py-1 px-4 rounded bg-neutral-700 border border-neutral-700 focus:outline-none focus:border-neutral-500"
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder='Enter link to article: http://www.paulgraham.com/newideas.html'
          value={url}
          />
        <div className="flex m-5 mx-auto justify-end">
          <button onClick={fetchSummary} className="bg-neutral-800 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Summarize
          </button>
            {/*
          <button onClick={fetchArticle} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
            Save
          </button>
          */}
        </div>

        {(!loading && article.title) && (
          <Card title={article.title} url={article.articleUrl} />
        )}
        {(!loading && summary) && (
          <div className="max-w-[800px] p-10">
            <p className="text-zinc-300 whitespace-pre-wrap text-left">
              {summary}
            </p>
          </div>
        )}

      </div>

      {loading && (
        <span className="mt-5 flex h-1 w-full">
          <span className="animate-pulse h-[3px] w-full rounded-full bg-zinc-600"></span>
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

const Card = ({ title, url }) => {
  const articleUrl = new URL(url)

  return (
    <div className="w-full flex justify-start items-center px-5 py-3 border border-neutral-600 rounded bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-neutral-800 to-neutral-800">
      <img src={`https://www.google.com/s2/favicons?domain=${url}&sz=${32}`} alt="favicon" className="rounded" />
      <div className={`flex flex-col items-start ml-5 ${hankenGrotesk.className}`}>
        <h3 className={`text-white m-0 text-xl`}>{title}</h3>
        <p className="text-neutral-400">{articleUrl.hostname}</p>
      </div>
    </div>
  )
}

export default Web;

