import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { hankenGrotesk } from "./_app";

import Card from "../components/card/Card";
import Search from "../components/Search";
import NewCardButton from "../components/NewCardButton";

/*
import Loader from "../components/Loader";
import Sidebar from "../components/sidebar/"

import { useKeyPress, useViewportWidth } from "../utils/hooks";
import { onKeyPress } from "../functions/keyboard";
import { getExcerpts } from "../functions/data"
import { deleteAndRefresh } from "../functions/deleteCard";
*/

export default function SearchResultsPage() {
  const router = useRouter();
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([])
  const [semanticMatches, setSemanticMatches] = useState([])
  const [query, setQuery] = useState("")

  const buildQuery = (phrase) => {
    let string = "";
    phrase
      .trim()
      .split(" ")
      .forEach((word) => {
        string += word + " <-> ";
      });

    return string.slice(0, string.length - 5);
  };

  const searchCards = async (phrase) => {
    const { data, error } = await supabaseClient.rpc("search_cards", {
      query: buildQuery(phrase),
    });

    if (!error) {
      const keywordBasedCardIds = data.map(c => c.id)
      setCards(data);
      await semanticSearch(phrase.trim(), keywordBasedCardIds)
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  const semanticSearch = async (phrase, cardIdsDisplayed) => {
    /*
    * Use this for running promises in parallel
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await fetch(`/api/search?phrase=${phrase}`)
        const { data } = await resp.json()
        resolve(data)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
    */
    const resp = await fetch(`/api/search?phrase=${phrase}`)
    const { data } = await resp.json()
    setSemanticMatches(data.filter(c => !cardIdsDisplayed.some(id => id === c.id)))
  }

  useEffect(() => {
    if (!router.isReady || !user) return;

    const { phrase } = router.query;
    if (phrase && phrase.trim()) {
      setQuery(phrase)
      searchCards(phrase);
    }
  }, [user, router.isReady, router.query])

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      {!loading && (
        <>
          <Search query={query} />
          <div className={`mt-5 flex flex-col items-center font-light text-lg ${hankenGrotesk.className}`}>
            {cards.map((card, idx) => {
              return <Card key={idx} card={card} />
            })}
            {semanticMatches.map((card, idx) => {
              return <Card key={idx} card={card} />
            })}
            {(!cards.length && !semanticMatches.length) && (
              <p className="mx-auto text-white">
                No cards found.
              </p>
            )}
          </div>
        </>
      )}
      <NewCardButton />
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
        destination: "/",
        permanent: false,
      }
    }
  }

  return {
    props: {
      initialSession: session
    }
  }
}
