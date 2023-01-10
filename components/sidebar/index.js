import { useContext, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

import Card from "../card/Card"
import { SidebarContext } from "../../utils/sidebarContext"

const Sidebar = () => {
  const pane = useRef(null)
  const [loading, setLoading] = useState(true)
  const [similarCards, setSimilarCards] = useState([])

  const { open, details, updateSidebar } = useContext(SidebarContext)

  const closeSidebar = { open: false, details, updateSidebar }

  const handleClickOutside = (e) => {
    if (pane.current && !pane.current.contains(e.target)) {
      updateSidebar(closeSidebar)
    }
  }

  const fetchSimilarCards = async (cardId) => {
    setLoading(true)
    const resp = await fetch(`/api/similar?cardId=${cardId}`)
    const { data } = await resp.json()
    setSimilarCards(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!open) return;

    if (details.function === "similarity") {
      fetchSimilarCards(details.card.id)
    }
  }, [open, details])

  return (
    <div onClick={handleClickOutside} className={`${open ? "fixed" : "hidden"} top-0 left-0 bg-zinc-800/50 w-[100vw] h-screen`}>
      <motion.aside
        ref={pane}
        className="ml-auto bg-neutral-800/80 h-screen p-5 overflow-y-auto"
        animate={{ width: open ? 480 : 0 }}
      >
        {open && (
          <Card card={details.card} size={"small"} />
        )}

        <h2 className="text-white text-xl pl-3 mb-4">Similar cards</h2>

        {!loading && similarCards.map((card, idx) => (
          <Card key={idx} card={card} size={"small"} />
        ))}
        {!loading && !similarCards.length && (
          <p className="text-white font-thin">No similar cards found.</p>
        )}
      </motion.aside>
    </div>
  )
}

export default Sidebar
