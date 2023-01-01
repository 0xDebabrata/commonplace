import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { hankenGrotesk } from "../_app";

import Card from "../../components/card/Card";

/*
import { useKeyPress, useViewportWidth } from "../../utils/hooks";
import { onKeyPress } from "../../functions/keyboard";
import { getExcerpts } from "../../functions/data"

import NewCardButton from "../../components/NewCardButton";
import Loader from "../../components/Loader";
import Sidebar from "../../components/sidebar/"
import CollectionHeader from "../../components/CollectionHeader";
*/

const CollectionPage = () => {
  const router = useRouter();
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState("")
  const [cards, setCards] = useState([])

  /*
  const { width } = useViewportWidth();  // For conditionally displaying sidebar

  // Cards Loading state
  const [loading, setLoading] = useState(true);
  // Collection id
  const [id, setId] = useState(null);
  // Array of cards having a certain tag
  const [cardArray, setCardArray] = useState(null);
  const [excerptsArr, setExcerptsArr] = useState([])  // Holds all excerpts for sidebar
  // Current collection name
  const [collectionName, setCollectionName] = useState(null);
  // Current collection author
  const [collectionAuthor, setCollectionAuthor] = useState(null);
  // Whether any card is available
  const [noCard, setNoCard] = useState(false);

  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => onKeyPress(e, router));

  // Get all card details
  const getCards = async (id) => {
    const { data: cards, error } = await supabaseClient
      .rpc("get_cards_by_collection", {
        collection_id_input: id
      })

    if (error) {
      console.log("Error getting card");
      return null;
    }

    // Handle no cards featuring the collection
    // Either the user has no cards for the collection
    // or the collection with given id does not exist (or user doesn't have access to it)
    if (cards.length === 0) {
      // Get collection details
      const { data: collection, err } = await supabaseClient
        .from("collections")
        .select("id, name, author")
        .eq("id", id);

      if (err) {
        console.error(err)
        return
      }

      // If no collection with given id exists
      if (collection.length === 0) {
        setNoCard(true);
        setLoading(false);
        return;
      }

      setCollectionName(collection[0].name);
      setCollectionAuthor(collection[0].author);
      setNoCard(true);
      setLoading(false);
      return;
    }

    setCollectionName(cards[0].collection.name);
    setCollectionAuthor(cards[0].collection.author);

    // Get card excerpts array for displaying in sidebar
    getExcerpts(cards, setExcerptsArr)

    setCardArray(cards);
    setLoading(false);
  };

  // Get card details
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    setId(id);
    getCards(id);
  }, [router.isReady, router.query]);
*/

  const getCards = async (id) => {
    const { data, error } = await supabaseClient.rpc("get_cards_by_collection", {
      collection_id_input: id
    })
    console.log(data)
    if (!error) {
      return data
    }
    setLoading(false)
  }

  const getEntity = async (id) => {
    const { data, error } = await supabaseClient.from("entities").select("name").eq("id", id)
    console.log(data)
    if (!error) {
      return data[0].name
    }
  }

  const loadInitialData = async (id) => {
    const [cards, entity] = await Promise.all([
      getCards(id),
      getEntity(id)
    ])
    setCards(cards)
    setEntity(entity)
    setLoading(false)
  }

  useEffect(() => {
    if (!router.isReady || !user) return;

    const { id } = router.query;
    loadInitialData(id)
  }, [user, router.isReady, router.query])

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      {!loading && (
        <>
          <h2 className="py-5 text-xl text-white max-w-[600px] mx-auto">
            {entity}
          </h2>
        <div className={`pt-5 flex flex-col items-center font-light text-lg ${hankenGrotesk.className}`}>
          {cards.map((card, idx) => {
            return <Card key={idx} card={card} />
          })}
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
      initialSession: session,
      user: session.user,
    }
  }
}

export default CollectionPage;
