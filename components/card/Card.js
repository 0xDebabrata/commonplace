import { useContext, useRef } from "react";
import Image from "next/image";
import { IconContext } from "react-icons"
import { FiDelete } from "react-icons/fi"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

import { SidebarContext } from "../../utils/sidebarContext";
import TwitterAuthor from "./TwitterAuthor"
import WebAuthor from "./WebAuthor"
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

  const { updateSidebar } = useContext(SidebarContext)
  const similarCards = {
    open: true,
    details: {
      function: "similarity",
      card
    }
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

      {card.source.type === "twitter" && (
        <a href={tweetUrl} target="_blank" rel="noopener">
          <p className="whitespace-pre-wrap pt-4 px-5">
            {card.data}
          </p>
          <TwitterAuthor author={card.author} />

          <div className="flex justify-center items-center absolute right-3 bottom-3 space-x-3">
            <div onClick={() => updateSidebar(similarCards)} className="hover:brightness-150 duration-150">
              <Image src="/similarity.svg" width={24} height={24} alt="Similar cards icon" title="Show similar cards" />
            </div>
            <IconContext.Provider value={{ className: "text-stone-500 text-xl hover:brightness-150 duration-150" }}>
              <FiDelete title="Delete card" onClick={deleteCard} />
            </IconContext.Provider>
          </div>
        </a>
      )}

      {card.source.type === "web" && (
        <a href={card.meta.url} target="_blank" rel="noopener">
          <p className={`pt-4 px-5 text-lg`}>{card.meta.title}</p>
          <p className="whitespace-pre-wrap pt-2 px-5 text-neutral-200">
            {card.meta.excerpt}
          </p>
          <WebAuthor author={card.author} meta={card.meta} />

          <div className="flex justify-center items-center absolute right-3 bottom-3 space-x-3">
            <IconContext.Provider value={{ className: "text-stone-500 text-xl hover:brightness-150 duration-150" }}>
              <FiDelete title="Delete card" onClick={deleteCard} />
            </IconContext.Provider>
          </div>
        </a>
      )}
    </div>
  );
}

export default Card;
