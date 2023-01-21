import { useState } from "react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"

export default function Feedback() {
  const user = useUser()
  const supabase = useSupabaseClient()

  const [disabled, setDisabled] = useState(false)
  const [show, setShow] = useState(false)
  const [feedback, setFeedback] = useState("")

  const insertFeedback = async (row) => {
    const { error } = await supabase.from("feedback").insert(row)
    if (error) throw error
  }

  const handleSubmit = async () => {
    setDisabled(true)
    const argument = {
      user_id: user?.id,
      email: user?.email,
      feedback,
      timestamp: new Date()
    }
    try {
      const p1 = fetch(`https://api.val.town/eval/@sircitrus.email(${JSON.stringify(argument)})`)
      const p2 = insertFeedback(argument)
      await Promise.all([p1, p2])
      console.log("Feedback submitted")
      setShow(false)
      setFeedback("")
    } catch (error) {
      console.error(error)
    } finally {
      setDisabled(false)
    }
  }

  return (
    <div className="relative">
      {show && (
        <div className="flex flex-col w-[300px] h-[160px] bg-neutral-600 border border-zinc-500 p-3 fixed bottom-10 right-10 rounded-md z-20">
          <p className="text-sm">I&apos;d love to hear your thoughts!</p>
          <textarea
            className="rounded resize-none focus:outline-none text-neutral-800 p-2 text-sm my-2"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="What do you like/dislike? Got any suggestions?"
            rows={4}
            cols={28}
          />
          <div className="ml-auto">
            <button onClick={() => setShow(false)} className="bg-neutral-600 border text-sm rounded py-1 px-4 mr-3">
              Close
            </button>
            <button onClick={handleSubmit} disabled={disabled} className="bg-zinc-200 text-neutral-800 text-sm rounded py-1 px-4">
              Send
            </button>
          </div>
        </div>
      )}
      <ul className="text-gray-400 flex space-x-8 pr-8 text-xs my-2 cursor-default">
        <li onClick={() => setShow(!show)}>Feedback</li>
      </ul>
    </div>
  )
}
