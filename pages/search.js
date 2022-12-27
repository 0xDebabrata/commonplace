import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { hankenGrotesk } from "../utils/fonts";

import Card from "../components/card/Card";
import Search from "../components/Search";

/*
import Loader from "../components/Loader";
import Sidebar from "../components/sidebar/"
import NewCardButton from "../components/NewCardButton";

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
      setCards(data);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady || !user) return;

    const { phrase } = router.query;
    if (phrase && phrase.trim()) {
      searchCards(phrase);
    }
  }, [user, router.isReady, router.query])

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      {!loading && (
        <>
          <Search />
          <div className={`mt-5 flex flex-col items-center font-light text-lg ${hankenGrotesk.className}`}>
            {cards.map((card, idx) => {
              return <Card key={idx} card={card} />
            })}
            {!cards.length && (
              <p className="mx-auto text-white">
                No cards found.
              </p>
            )}
          </div>
        </>
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
