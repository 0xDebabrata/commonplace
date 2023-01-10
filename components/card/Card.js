import { useContext, useRef } from "react";
import Image from "next/image";
import { IconContext } from "react-icons"
import { FiDelete } from "react-icons/fi"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

import { SidebarContext } from "../../utils/sidebarContext";
/*
import Excerpt from "../new/Excerpt";
import Note from "../new/Note";
import DisplayTags from "./DisplayTags";
import Collection from "./Collection";
import DisplayDate from "./Date";
import DeleteCard from "./Delete";

const Card = forwardRef(
  ({ excerpt, note, tags, collection, date, deleteFunc, id }, parentRef) => {
    return (
      <div id={id} className={styles.container}>
        <DisplayDate date={date} />
        <Excerpt excerpt={excerpt} />
        <div className={styles.tagsContainer}>
          <DisplayTags tags={tags} />
        </div>
        <Note note={note} />
        <div className={styles.wrapper}>
          {collection && <Collection collection={collection} />}
          {!collection && <div></div>}
          <DeleteCard parentRef={parentRef} deleteFunc={deleteFunc} id={id} />
        </div>
      </div>
    );
  }
);
*/
const Card = ({ card, size }) => {
  const div = useRef(null)
  const supabaseClient = useSupabaseClient()
  const tweetUrl = `https://twitter.com/twitter/status/${card.meta.id}`
  const authorUrl = `https://twitter.com/${card.author.username}`

  const { updateSidebar } = useContext(SidebarContext)
  const similarCards = {
    open: true,
    details: {
      function: "similarity",
      card
    }
  }

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/Logo.png"
  }

  const deleteCard = async () => {
    const { error } = await supabaseClient.from("cards").delete().eq("id", card.id)
    if (!error) {
      if (div.current) {
        div.current.remove()
      }
    } else {
      console.error(error)
    }
  }

  return (
    <div id={card.id} ref={div}
      className={`relative text-white bg-stone-700 ${size === "small" ? `w-[420px]` : "w-[600px]"} rounded-lg mb-7 mx-auto cursor-default border border-zinc-600 hover:border-zinc-500`}>
      <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
        <p className="whitespace-pre-wrap pt-4 px-5">
          {card.data}
        </p>

        {card.source.type === "twitter" && (
          <div className="flex items-center py-4 px-5">
            <img alt="Twitter profile picture" 
              width={28}
              height={28}
              className="mr-3 rounded-full"
              src={card.author.profile_image_url}
              onError={handleImgError}
              />

            <a href={authorUrl} target="_blank" rel="noopener noreferrer">
              <div className="text-slate-300 hover:underline hover:underline-offset-4">{card.author.name}</div>
            </a>
          </div>
        )}
      </a>
      <div className="flex justify-center items-center absolute right-3 bottom-3 space-x-3">
        <div onClick={() => updateSidebar(similarCards)} className="hover:brightness-150 duration-150">
          <Image src="/similarity.svg" width={24} height={24} alt="Similar cards icon" title="Show similar cards" />
        </div>
        <IconContext.Provider value={{ className: "text-stone-500 text-xl hover:brightness-150 duration-150" }}>
          <FiDelete title="Delete card" onClick={deleteCard} />
        </IconContext.Provider>
      </div>
    </div>
  );
}

export default Card;
