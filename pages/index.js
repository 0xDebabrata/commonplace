import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { hankenGrotesk } from "../utils/fonts";
import { getSmartCollections } from "../functions/twitter/supabase"

import Homepage from "../components/home/Homepage";
import ConnectTwitter from "../components/twitter/Connect";
import Search from "../components/Search";
import SmartCollections from "../components/SmartCollections";
import Card from "../components/card/Card";

/*
import { useKeyPress } from "../utils/hooks";
import { onKeyPress } from "../functions/keyboard";

import NewCardButton from "../components/NewCardButton";
import TagBlock from "../components/TagBlock";
import Collections from "../components/index/Collections";
*/


export default function Home() {
  const user = useUser();
  const supabaseClient = useSupabaseClient()

  const [loading, setLoading] = useState(true)
  const [twitterId, setTwitterId] = useState(null)
  const [smartCollections, setSmartCollections] = useState([])
  const [cards, setCards] = useState([])

  const getTwitterId = async () => {
    const { data, error } = await supabaseClient.from("users").select("twitter_auth_token->>twitter_id")
    if (!error) return data[0]
  }

  const getCards = async () => {
    const { data, error } = await supabaseClient.rpc("get_cards")
    if (!error) return data
  }

  const loadInitialData = async () => {
    const { twitter_id } = await getTwitterId()
    setTwitterId(twitter_id)

    if (twitter_id) {
      // Load smart collections and cards
      const [collections, cards] = await Promise.all([
        getSmartCollections(supabaseClient, user.id),
        getCards()
      ])
      setSmartCollections(collections)
      setCards(cards)
    }

    setLoading(false)
  }

  /*
  const [tags, setTags] = useState(null);
  const [collections, setCollections] = useState(null);
  // Loading state for tags
  const [tagsLoading, setTagsLoading] = useState(true);
  // Loading state for collections
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => handleKeyPress(e));

  const handleKeyPress = (e) => {
    const body = document.getElementsByTagName("body")[0];
    if (document.activeElement === body) {
      onKeyPress(e, router);
    }
  };

  // Get user's tags from db
  const getTags = async () => {
    const { data: tags, error } = await supabaseClient.from("tags").select("*");

    if (error) {
      console.log(error);
    } else {
      setTags(tags);
      setTagsLoading(false);
    }
  };

  // Get user's collections from db
  const getCollections = async () => {
    const { data: collections, error } = await supabaseClient
      .from("collections")
      .select("*");

    if (error) {
      console.log(error);
    } else {
      setCollections(collections);
      setCollectionsLoading(false);
    }
  };
*/

  
  useEffect(() => {
    if (user) {
      /*
      getTags();
      getCollections();
      setLoading(false);
*/
      // Load user's twitter ID and smart collections and cards
      loadInitialData()
    }
  }, [user]);

  if (!user) {
    return <Homepage />;
  }

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      {!loading && (
        <>
          {twitterId ? 
            (
              <>
                <Search />
                <SmartCollections collections={smartCollections} />
                <div className={`flex flex-col items-center font-light text-lg ${hankenGrotesk.className}`}>
                  {cards.map((card, idx) => {
                    return <Card key={idx} card={card} />
                  })}
                </div>
              </>
            ) : <ConnectTwitter />
          }
        </>
      )}
                  {/*
      {!loading && (
        <>
          {!tagsLoading && !collectionsLoading && (
            <div>
              <h2 className={styles.header}>Tags</h2>
              <div className={styles.container}>
                <>
                  {tags.map((tag) => {
                    return <TagBlock key={tag.id} tag={tag} />;
                  })}
                </>
                <NewCardButton />
              </div>
              <Collections collections={collections} />
            </div>
          )}
        </>
      )}
                */}
    </div>
  );
}
