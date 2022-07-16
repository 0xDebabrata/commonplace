import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { withPageAuth, getUser } from "@supabase/auth-helpers-nextjs";

import supabase from "../../utils/supabaseClient";
import { useKeyPress, useViewportWidth } from "../../utils/hooks";
import { onKeyPress } from "../../functions/keyboard";
import { getExcerpts } from "../../functions/data"

import NewCardButton from "../../components/NewCardButton";
import Loader from "../../components/Loader";
import Sidebar from "../../components/sidebar/"
import Card from "../../components/card/Card";
import TagHeader from "../../components/TagHeader";

import { deleteAndRefresh } from "../../functions/deleteCard";

import styles from "../../styles/tagPage.module.css";

const TagPage = () => {
  // Get card id from link address
  const router = useRouter();
  const { width } = useViewportWidth();  // Get width for conditionally displaying sidebar

  const [loading, setLoading] = useState(true);
  const [cardArray, setCardArray] = useState(null);
  const [excerptsArr, setExcerptsArr] = useState([])    // Holds all excerpts for sidebar
  const [tagName, setTagName] = useState(null);    // Holds tag name for header
  const [tagColour, setTagColour] = useState(null);    // Holds tag colour for header
  const [noCard, setNoCard] = useState(false);    // If no cards with tag
  const [tagId, setTagId] = useState(null); // Holds tag id for deleting tag

  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => onKeyPress(e, router));

  // Get all card details
  const getCard = async (id) => {
    const { data: cards, error } = await supabase
      .rpc("get_cards_by_tags", {
        tags_input: [id]
      })

    if (error) {
      console.log("Error getting card");
      return null;
    }

    // Handle no cards found
    // Either the user has no cards for the tag
    // or the tag with given id does not exist (or user doesn't have access to it)
    if (cards.length === 0) {
      // Get tag details
      const { data: tag } = await supabase
        .from("tags")
        .select("id, name, colour")
        .eq("id", id);

      // If no tag with given id exists
      if (tag.length === 0) {
        setNoCard(true);
        setLoading(false);
        return;
      }

      setTagName(tag[0].name);
      setTagColour(tag[0].colour);
      setNoCard(true);
      setLoading(false);
      return;
    }

    // Get current tag name
    cards[0].tags.forEach((tagObject) => {
      if (tagObject.id === parseInt(id)) {
        setTagName(tagObject.name);
        setTagColour(tagObject.colour);
      }
    });

    // Get card excerpts array for displaying in sidebar
    getExcerpts(cards, setExcerptsArr)

    setCardArray(cards);
    setLoading(false);
  };

  // Get card details
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    setTagId(id);
    getCard(id);
  }, [router.isReady, router.query]);

  return (
    <>
      <div className={styles.container}>
        {loading && <Loader />}

        {!loading && (
          <>
            {!noCard && (
              <div className={styles.flex}>
                {width > 950 && <Sidebar excerptArr={excerptsArr} />}

                <div className={styles.main}>
                  <TagHeader
                    tagColour={tagColour}
                    tagName={tagName}
                    allowDelete={false}
                    id={tagId}
                    router={router}
                  />

                  <div className={styles.cardsList}>
                    {cardArray.map((card) => {
                      return (
                        <Card
                          key={card.id}
                          excerpt={card.excerpt}
                          note={card.note}
                          tags={card.tags}
                          collection={card.collection}
                          date={card.created_at}
                          deleteFunc={deleteAndRefresh}
                          id={card.id}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {noCard && tagName && (
              <>
                <TagHeader
                  tagColour={tagColour}
                  tagName={tagName}
                  allowDelete={true}
                  id={tagId}
                  router={router}
                />
                <p className={styles.text}>You don't have any cards for this tag.</p>
              </>
            )}

            {noCard && !tagName && <p className={styles.text}>No such tag exists</p>}
          </>
        )}
      </div>

      <NewCardButton />
    </>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/signin" })

export default TagPage;
