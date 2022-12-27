import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { getSmartCollections } from "../functions/twitter/supabase"

import ConnectTwitter from "../components/twitter/Connect";
import SmartCollections from "../components/SmartCollections";

import { useKeyPress } from "../utils/hooks";
import { onKeyPress } from "../functions/keyboard";

import Homepage from "../components/home/Homepage";
import NewCardButton from "../components/NewCardButton";
import TagBlock from "../components/TagBlock";
import Collections from "../components/index/Collections";


export default function Home() {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient()

  const [loading, setLoading] = useState(true)
  const [twitterId, setTwitterId] = useState(null)
  const [smartCollections, setSmartCollections] = useState([])

  const getTwitterId = async () => {
    const { data, error } = await supabaseClient.from("users").select("twitter_auth_token->>twitter_id")
    if (!error) return data[0]
  }

  const loadInitialData = async () => {
    const { twitter_id } = await getTwitterId()
    setTwitterId(twitter_id)

    if (twitter_id) {
      // Load smart collections
      const { data } = await getSmartCollections(supabaseClient, user.id)
      setSmartCollections(data)
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

  // Load tags on page load after making sure user's authenticated
  useEffect(() => {
    if (user) {
      /*
      getTags();
      getCollections();
      setLoading(false);
*/
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
              <SmartCollections collections={smartCollections} />
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
