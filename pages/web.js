import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { hankenGrotesk } from "./_app";
import { IconContext } from "react-icons"
import { BiArrowBack } from "react-icons/bi"
import splitbee from "@splitbee/web"; 

import SmartCollections from "../components/SmartCollections";

const Web = () => {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const [url, setUrl] = useState("")
  const [article, setArticle] = useState({})
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [collections, setCollections] = useState([])

  const fetchArticle = async () => {
    setLoading(true)
    const { data } = await supabaseClient.functions.invoke('fetch-article', {
      body: {
        type: 'fetch',
        articleUrl: url
      }
    })
    setArticle({...data, articleUrl: url})

    setLoading(false)

    const resp = await fetch("/api/smart-collections", {
      method: "POST",
      body: JSON.stringify({
        cardId: data.cardId,
        text: data.title + " " + data.textContent.slice(0, 30000)
      })
    })
    const entities = await resp.json()
    setCollections(entities)
  }

  const fetchSummary = async () => {
    try {
      setError("")
      setLoading(true)
      const { data: { data, article }} = await supabaseClient.functions.invoke('fetch-article', {
        body: {
          type: 'summarize',
          articleUrl: url
        }
      })

      setArticle({
        title: article.title,
        articleUrl: url
      })
      setSummary(data.text)

      // Analytics
      splitbee.track("Article summary", {
        articleUrl: url,
        article: article,
        summary: data.text,
        status: "Success",
      })
    } catch (error) {
      console.error(error)
      setError("There was a problem fetching your article :(\nWe are working on fixing it!")
      setArticle({})
      setSummary("")

      // Analytics
      splitbee.track("Article summary", {
        articleUrl: url,
        status: "Fail",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-[800px] text-center px-10">
        <h2 className="text-white text-2xl pt-8">Summarize articles from the web</h2>
        <input
          className="text-zinc-200 w-full mt-3 py-1 px-4 rounded bg-neutral-700 border border-neutral-700 focus:outline-none focus:border-neutral-500"
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder='Enter link to article: http://www.paulgraham.com/newideas.html'
          value={url}
          />
        <div className="flex m-4 mx-auto justify-between items-center">
          <div onClick={handleBack} className="flex items-center group cursor-pointer">
            <IconContext.Provider value={{ className: "text-zinc-300 text-xl group-hover:-translate-x-1 group-hover:text-white duration-150" }}>
              <BiArrowBack />
            </IconContext.Provider>
            <p className="ml-3 text-zinc-300 group-hover:text-white duration-150">Home</p>
          </div>
          <div>
            <button onClick={fetchSummary} className="bg-neutral-800 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
              Summarize
            </button>
            <button onClick={fetchArticle} className="bg-neutral-700 py-1 px-4 text-zinc-300 text-sm border border-neutral-600 rounded ml-5">
              Save
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-300 whitespace-pre-wrap">{error}</p>
        )}

        {(!loading && article.title) && (
          <>
            <Card title={article.title} url={article.articleUrl} byline={article.byline}/>
            <div className="mt-1">
              <SmartCollections collections={collections} />
            </div>
          </>
        )}
        {(!loading && summary) && (
          <div className="max-w-[800px] p-10">
            <p className="text-zinc-200 whitespace-pre-wrap text-left">
              {summary.trimStart()}
            </p>
            <div className="text-zinc-400 mt-10 text-sm">
              <p>Did you like this summary?</p>
              <div className="flex space-x-5 justify-center cursor-default">
                <p className="hover:text-green-300 duration-150">Yes</p>
                <p className="hover:text-red-300 duration-150">No</p>
              </div>
            </div>
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

const Card = ({ title, url, byline }) => {
  const articleUrl = new URL(url)

  return (
    <div className="w-full flex justify-start items-center px-5 py-3 border border-neutral-600 rounded bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-neutral-800 to-neutral-800">
      <img src={`https://www.google.com/s2/favicons?domain=${url}&sz=${32}`} alt="favicon" className="rounded" />
      <div className={`flex flex-col items-start ml-5 overflow-hidden ${hankenGrotesk.className}`}>
        <p className={`text-white m-0 text-lg`}>{title}</p>
        <div className="flex items-center">
          <p className="text-neutral-300 mr-3">{byline}</p>
          <a href={url} target="_blank" rel="noopener">
            <p className="text-neutral-400 hover:underline text-sm">{articleUrl.hostname}</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Web;

