import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";

import { useKeyPress } from "../../utils/hooks";
import { onKeyPress } from "../../functions/keyboard";

import NewCardButton from "../../components/NewCardButton";
import Loader from "../../components/Loader";
import Card from "../../components/card/Card";

import styles from "../../styles/cardpage.module.css";
import { deleteAndRedirect } from "../../functions/deleteCard";

const CardPage = () => {
  // Get card id from link address
  const router = useRouter();

  const childRef = useRef();

  // Loading state
  const [loading, setLoading] = useState(true);
  // Card state
  const [card, setCard] = useState(null);

  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => onKeyPress(e, router));

  // Get all card details
  const getCard = async (id) => {
    const { data, error } = await supabaseClient
      .rpc("get_card", {
        card_id_input: id
      })

    if (error) {
      console.error(error)
      return
    }

    setCard(data[0]);
    setLoading(false);
  };

  // Get card details
  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    getCard(id);
  }, [router.isReady]);

  return (
    <>
      <div className={styles.container}>
        {loading && <Loader />}

        {!loading && (
          <>
            <Card
              parentRef={childRef}
              excerpt={card.excerpt}
              note={card.note}
              tags={card.tags}
              collection={card.collection}
              date={card.created_at}
              deleteFunc={deleteAndRedirect}
              id={card.id}
            />
          </>
        )}
      </div>
      <NewCardButton />
    </>
  );
};

export const getServerSideProps = withPageAuth({ redirectTo: "/signin" })

export default CardPage;
