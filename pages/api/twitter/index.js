import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { setCookie } from "cookies-next"
import { randomBytes } from "node:crypto"
const { auth } = require("twitter-api-sdk")

const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID,
  client_secret: process.env.TWITTER_CLIENT_SECRET,
  callback: `${process.env.NEXT_PUBLIC_REDIRECT_URL}callback`,
  scopes: ["users.read", "tweet.read", "bookmark.read", "offline.access"]
})

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated." })
  }

  const state = randomBytes(16).toString("hex")
  setCookie(`${session.user.id}-state`, state, { req, res, maxAge: 60 * 60 })

  const authUrl = authClient.generateAuthURL({
    state,
    code_challenge_method: "s256",
  })

  return res.redirect(authUrl)
}
