import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Loader from "../components/Loader";
import Card from "../components/card/Card";
import Sidebar from "../components/sidebar/"
import NewCardButton from "../components/NewCardButton";

import { useKeyPress, useViewportWidth } from "../utils/hooks";
import { onKeyPress } from "../functions/keyboard";
import { getExcerpts } from "../functions/data"
import { deleteAndRefresh } from "../functions/deleteCard";

import styles from "../styles/search.module.css";

const Search = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient()
  const { width } = useViewportWidth()  // For conditionally displaying sidebar

  const [loading, setLoading] = useState(true);
  const [cardArray, setCardArray] = useState(null);
  const [excerptsArr, setExcerptsArr] = useState([]);  // Store card excerpts for sidebar

  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => onKeyPress(e, router));

  useEffect(() => {
    if (!router.isReady) return;

    const { phrase } = router.query;
    if (phrase && phrase.trim()) {
      search(phrase);
    }
  }, [router.isReady, router.query]);

  const search = async (phrase) => {
    const { data, error } = await supabaseClient.rpc("search", {
      query: buildQuery(phrase),
    });

    if (!error) {
      getExcerpts(data, setExcerptsArr)
      setCardArray(data);
    } else {
      console.error(error);
    }

    setLoading(false);
  };

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

  return (
    <div className={styles.container}>
      {loading ? (
        <Loader />
      ) : cardArray.length !== 0 ? (
        <div className={styles.flex}>
          {width > 950 && <Sidebar excerptArr={excerptsArr} />}

          <div className={styles.main}>
            <div className={styles.cardsList}>
              {cardArray.map((card) => {
                return (
                  <Card
                    key={card.id}
                    excerpt={card.data}
                    note={card.note}
                    tags={card.card_tag}
                    collection={card.collections}
                    date={card.created_at}
                    deleteFunc={deleteAndRefresh}
                    id={card.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p>No cards found</p>
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
      initialSession: session,
      user: session.user,
    }
  }
}

export default Search;
