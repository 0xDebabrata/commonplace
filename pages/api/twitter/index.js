import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { setCookie } from "cookies-next"
import { randomBytes } from "node:crypto"
import { sign } from "jsonwebtoken"
const { auth } = require("twitter-api-sdk")

const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID,
  client_secret: process.env.TWITTER_CLIENT_SECRET,
  callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitter/callback`,
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

  const cookieOptions = {
    req,
    res,
    maxAge: 60,
    httpOnly: true
  }

  const authCredentials = {
    state: randomBytes(16).toString("hex"), 
    challenge: randomBytes(16).toString("hex"),
  }

  const cookie = sign(
    authCredentials,
    process.env.JWT_SECRET_KEY, 
    { expiresIn: 60 }
  )

  setCookie(`${session.user.id}-twitter-OAuth`, cookie, cookieOptions)

  const authUrl = authClient.generateAuthURL({
    state: authCredentials.state,
    code_challenge_method: "plain",
    code_challenge: authCredentials.challenge
  })

  return res.redirect(authUrl)
}
