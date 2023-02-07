import { useContext, useRef } from "react";
import Image from "next/image";
import { IconContext } from "react-icons"
import { FiDelete } from "react-icons/fi"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

import { SidebarContext } from "../../utils/sidebarContext";
import TwitterAuthor from "./TwitterAuthor"
import WebAuthor from "./WebAuthor"

const Card = ({ card, size }) => {
  const div = useRef(null)
  const actionsBtn = useRef(null)
  const authorContainer = useRef(null)
  const supabaseClient = useSupabaseClient()

  const { updateSidebar } = useContext(SidebarContext)
  const similarCards = {
    open: true,
    details: {
      function: "similarity",
      card
    }
  }

  const getSourceUrl = () => {
    switch(card.source.type) {
      case "twitter":
        const tweetUrl = `https://twitter.com/twitter/status/${card.meta.id}`
        return tweetUrl
      case "web":
        return card.meta.url
      default:
        return null
    }
  }

  const handleClickOnCard = (e) => {
    if (actionsBtn.current && actionsBtn.current.contains(e.target)) {
      return
    }
    if (authorContainer.current && authorContainer.current.contains(e.target)) {
      return
    }
    
    // Open source in new tab
    const a = document.createElement("a")
    a.href = getSourceUrl()
    a.setAttribute("target", "_blank")
    a.setAttribute("rel", "noopener")
    a.click()
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
        <div
          onClick={handleClickOnCard}
        >
          <p className="whitespace-pre-wrap pt-4 px-5">
            {card.data}
          </p>
          <div ref={authorContainer}>
            <TwitterAuthor author={card.author} />
          </div>

          <div ref={actionsBtn} className="flex justify-center items-center absolute right-3 bottom-3 space-x-3">
            <div onClick={() => updateSidebar(similarCards)} className="hover:brightness-150 duration-150">
              <Image src="/similarity.svg" width={24} height={24} alt="Similar cards icon" title="Show similar cards" />
            </div>
            <IconContext.Provider value={{ className: "text-stone-400 text-xl hover:brightness-150 duration-150" }}>
              <FiDelete title="Delete card" onClick={deleteCard} />
            </IconContext.Provider>
          </div>
        </div>
      )}

      {card.source.type === "web" && (
        <div
          onClick={handleClickOnCard}
        >
          <p className={`pt-4 px-5 text-lg`}>{card.meta.title}</p>
          <p className="whitespace-pre-wrap pt-2 px-5 text-neutral-200">
            {card.meta.excerpt}
          </p>
          <div ref={authorContainer}>
            <WebAuthor author={card.author} meta={card.meta} />
          </div>

          <div ref={actionsBtn} className="flex justify-center cursor-pointer items-center absolute right-3 bottom-3 space-x-3">
            <IconContext.Provider value={{ className: "text-stone-400 text-xl hover:brightness-150 duration-150" }}>
              <FiDelete title="Delete card" onClick={deleteCard} />
            </IconContext.Provider>
          </div>
        </div>
      )}
      {card.chunk && (
        <div className="p-4 pb-9 bg-stone-600">
          <p className="text-[16px] text-zinc-200 line-clamp-4 leading-6">
            {card.chunk.trim()}
          </p>
        </div>
      )}
    </div>
  );
}

export default Card;
