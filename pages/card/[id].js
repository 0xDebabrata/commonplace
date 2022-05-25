import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import supabase from "../../utils/supabaseClient";
import { useKeyPress } from "../../utils/hooks";
import { onKeyPress } from "../../functions/keyboard";

import ProtectedRoute from "../../components/ProtectedRoute";
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
    const { data, error } = await supabase
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
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default CardPage;
