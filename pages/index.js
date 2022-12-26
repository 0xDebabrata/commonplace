import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useKeyPress } from "../utils/hooks";
import { onKeyPress } from "../functions/keyboard";

import Homepage from "../components/home/Homepage";
import NewCardButton from "../components/NewCardButton";
import TagBlock from "../components/TagBlock";
import Collections from "../components/index/Collections";

import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient()

  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState(null);
  // Loading state for tags
  const [tagsLoading, setTagsLoading] = useState(true);
  // Loading state for collections
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  /*
  // Set keyboard shortcuts
  useKeyPress(["N"], (e) => handleKeyPress(e));

  const handleKeyPress = (e) => {
    const body = document.getElementsByTagName("body")[0];
    if (document.activeElement === body) {
      onKeyPress(e, router);
    }
  };
*/

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

  const connectTwitter = async () => {
    fetch("/api/twitter")
  }

  // Load tags on page load after making sure user's authenticated
  useEffect(() => {
    if (user) {
      getTags();
      getCollections();
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return <Homepage />;
  }

  return (
    <div className="bg-neutral-800 min-h-[calc(100vh-89px)]">
      <div className="text-neutral-100 mx-auto max-w-[800px] pt-28 mx-10">
        <h2 className="text-5xl mb-5">
          Get started
        </h2>
        <p className="text-xl mb-10">
          Begin your journey towards zero information overload.<br />
          Start syncing your Twitter bookmarks.
        </p>

          <a href="/api/twitter">
        <button className="bg-neutral-700 rounded py-1 px-5 text-base border border-neutral-600 font-bold"
        >
          Connect Twitter
        </button>
        </a>
      </div>
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
