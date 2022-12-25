import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { deleteCookie, getCookie } from "cookies-next"
import { verify } from "jsonwebtoken"
const { auth, Client } = require("twitter-api-sdk")
import { createCipheriv, randomBytes } from "node:crypto"

const algorithm = "aes-256-cbc"
const key = new Buffer.from(process.env.AES_KEY, "hex")

const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID,
  client_secret: process.env.TWITTER_CLIENT_SECRET,
  callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitter/callback`,
  scopes: ["users.read", "tweet.read", "bookmark.read", "offline.access"]
})

const client = new Client(authClient)

const encrypt = (token, iv) => {
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = cipher.update(token, "utf-8", "hex") + cipher.final("hex")
  return encrypted
}

export default async function handler(req, res) {
  /*
  const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID,
    client_secret: process.env.TWITTER_CLIENT_SECRET,
    callback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/twitter/callback`,
    scopes: ["users.read", "tweet.read", "bookmark.read", "offline.access"],
    token: {
      refresh_token: '',
      expires_at: 1671914071264
    }
  })

  const { token } = await authClient.refreshAccessToken()
  return res.status(200).json(token)
  */

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

  const { code, state } = req.query

  // Get OAuth state and challenge from cookie
  const jwt = getCookie(`${session.user.id}-twitter-OAuth`, cookieOptions)

  try {
    const cookie = verify(jwt, process.env.JWT_SECRET_KEY)

    if (state !== cookie.state) {
      deleteCookie(`${session.user.id}-twitter-OAuth`, cookieOptions)
      return res.status(500).send("State invalid")
    }
    if (typeof code !== "string") {
      deleteCookie(`${session.user.id}-twitter-OAuth`, cookieOptions)
      return res.status(500).send("Code is not a string")
    }

    // Generate token
    const authUrl = authClient.generateAuthURL({
      state: cookie.state,
      code_challenge_method: "plain",
      code_challenge: cookie.challenge
    })

    const { token } = await authClient.requestAccessToken(code)

    // Encrypt token and store in Supabase
    const iv = randomBytes(16)
    const encryptedAT = encrypt(token.access_token, iv)
    const encryptedRT = encrypt(token.refresh_token, iv)

    const twitterCredentials = {
      token_type: token.token_type,
      access_token: encryptedAT,
      refresh_token: encryptedRT,
      iv: iv.toString("hex"),
      scope: token.scope,
      expires_at: token.expires_at,
    }

    deleteCookie(`${session.user.id}-twitter-OAuth`, cookieOptions)

    const { error } = await supabase
      .from("users")
      .update({ twitter_auth_token: twitterCredentials })
      .eq("id", session.user.id)

    if (error) {
      return res.status(500).json(error)
    }

    // Get first 10 bookmarks
    const { data } = client.users.findMyUser({
      "user.fields": ["id"]
    })

    const { data: bookmarks, includes, meta } = client.bookmarks.getUsersIdBookmarks(
      data.id, 
      {
        max_results: 10,
        "tweet.fields": ["lang", "entities", "context_annotations"],
        expansions: ["author_id", "entities.mentions.username"],
      }
    )
    


    return res.status(200).json({ twitterCredentials })

  } catch (error) {
    return res.status(500).json(error)
  }
}

