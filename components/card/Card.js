import Image from "next/image";
import { useContext } from "react";

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

  return (
    <div id={card.id} className={`relative text-white bg-stone-700 ${size === "small" ? `w-[420px]` : "w-[600px]"} rounded-lg mb-7 mx-auto cursor-default border border-zinc-600 hover:border-zinc-500`}>
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
      <div onClick={() => updateSidebar(similarCards)} className="absolute bottom-3 right-3 brightness-100 hover:brightness-150 duration-150">
        <Image src="/similarity.svg" width={24} height={24} alt="Get similar cards icon" title="Get similar cards" />
      </div>
    </div>
  );
}

export default Card;
