import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import { useKeyPress } from "../../utils/hooks";
import { onKeyPress } from "../../functions/keyboard";

import ProtectedRoute from "../../components/ProtectedRoute";
import NewCardButton from "../../components/NewCardButton";
import Loader from "../../components/Loader";
import Sidebar from "../../components/sidebar/"
import Card from "../../components/card/Card";
import CollectionHeader from "../../components/CollectionHeader";

import styles from "../../styles/collectionPage.module.css";

const CollectionPage = () => {
  // Get card id from link address
  const router = useRouter();

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
  const getCard = async (id) => {
    const { data: cards, error } = await supabase
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
      const { data: collection, err } = await supabase
        .from("collections")
        .select("id, name, author")
        .eq("id", id);

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
    getExcerpts(cards)

    setCardArray(cards);
    setLoading(false);
  };

  const getExcerpts = (cardArr) => {
    const excerpts = []
    for (const card of cardArr) {
      const { id, excerpt } = card
      excerpts.push({
        excerpt,
        id
      })
    }
    setExcerptsArr(excerpts)
  }

  // Get card details
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    setId(id);
    getCard(id);
  }, [router.isReady, router.query]);

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {loading && <Loader />}

        {!loading && (
          <>
            {!noCard && (
              <div className={styles.flex}>
                <Sidebar excerptArr={excerptsArr} />

                <div className={styles.main}>
                  <CollectionHeader
                    collectionName={collectionName}
                    collectionAuthor={collectionAuthor}
                    allowDelete={false}
                    id={id}
                    router={router}
                  />

                  <div className={styles.cardsList}>
                    {cardArray.map((card) => {
                      return (
                        <Card
                          id={card.id}
                          key={card.id}
                          excerpt={card.excerpt}
                          note={card.note}
                          tags={card.tags}
                          collection={card.collection}
                          date={card.created_at}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {noCard && collectionName && (
              <CollectionHeader
                collectionName={collectionName}
                collectionAuthor={collectionAuthor}
                allowDelete={true}
                id={id}
                router={router}
              />
            )}

            {noCard && !collectionName && <p>No such collection exists</p>}
          </>
        )}
      </div>
      <NewCardButton />
    </ProtectedRoute>
  );
};

export default CollectionPage;
