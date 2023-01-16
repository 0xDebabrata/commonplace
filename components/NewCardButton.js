import React from 'react'
import Link from 'next/link'
import { IconContext } from "react-icons"
import { TfiWorld } from "react-icons/tfi"

const NewCardButton = () => {
  return (
    <Link href='/web'>
      <div className="fixed bottom-8 right-10 bg-zinc-300 p-2 rounded-full hover:brightness-150 duration-150">
        <IconContext.Provider value={{ className: "text-stone-600 text-2xl" }}>
          <TfiWorld title="Summarize articles" />
        </IconContext.Provider>
      </div>
    </Link>
  )
}

export default NewCardButton
