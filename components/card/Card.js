import Link from "next/link"

import Excerpt from "../new/Excerpt";
import Note from "../new/Note";
import DisplayTags from "./DisplayTags";
import Collection from "./Collection";
import DisplayDate from "./Date";
import DeleteCard from "./Delete";

/*
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

const Card = ({ card }) => {
  const tweetUrl = `https://twitter.com/twitter/status/${card.meta.id}`
  const authorUrl = `https://twitter.com/${card.author.username}`

  return (
    <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
      <div id={card.id} className="text-white bg-stone-700 w-[600px] rounded-lg mb-7 px-5 py-4 cursor-default border border-zinc-600 hover:border-zinc-500">
        <p className="whitespace-pre-wrap">
          {card.data}
        </p>

        {card.source.type === "twitter" && (
          <div className="flex items-center pt-4">
            <img alt="Twitter profile picture" 
              width={28}
              height={28}
              className="mr-3 rounded-full"
              src={card.author.profile_image_url}
              />

            <a href={authorUrl} target="_blank" rel="noopener noreferrer">
              <div className="text-slate-300 hover:underline hover:underline-offset-4">{card.author.name}</div>
            </a>
          </div>
        )}
        <div>
        </div>
      </div>
    </a>
  );
}

export default Card;
