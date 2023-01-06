import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { deleteCookie, getCookie } from "cookies-next"
import { verify } from "jsonwebtoken"
const { auth, Client } = require("twitter-api-sdk")
import { createCipheriv, randomBytes } from "node:crypto"
import { clean } from "../../../functions/twitter/embeddings"
import { createEmbeddings } from "../../../functions/openai"
import { enqueueBookmarkHead, enqueueBookmarks, insertBookmarks, upsertAuthors } from "../../../functions/twitter/supabase"
import { insertVectors } from "../../../functions/pinecone"

const algorithm = "aes-256-cbc"
const key = new Buffer.from(process.env.AES_KEY, "hex")

// Twitter client
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
  let sync = false;
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

    // Get first 10 bookmarks
    const { data } = await client.users.findMyUser({
      "user.fields": ["id"]
    })
    const { data: bookmarks, includes, meta } = await client.bookmarks.getUsersIdBookmarks(
      data.id, 
      {
        max_results: 10,
        "tweet.fields": ["lang", "entities", "context_annotations"],
        "user.fields": ["profile_image_url", "description"],
        expansions: ["author_id", "entities.mentions.username"],
      }
    )

    // Encrypt token and store in Supabase
    const iv = randomBytes(16)
    const encryptedAT = encrypt(token.access_token, iv)
    const encryptedRT = encrypt(token.refresh_token, iv)

    const twitterCredentials = {
      twitter_id: data.id,
      token_type: token.token_type,
      access_token: encryptedAT,
      refresh_token: encryptedRT,
      iv: iv.toString("hex"),
      scope: token.scope,
      expires_at: token.expires_at,
    }

    const { error } = await supabase
      .from("users")
      .update({ twitter_auth_token: twitterCredentials })
      .eq("id", session.user.id)

    if (error) {
      throw error
    }

    if (!bookmarks.length) {
      // Add to queue for syncing
      await enqueueBookmarkHead(supabase, "0", data.id, session.user.id)
      sync = true;
      return res.redirect("/")
    }

    // Upload bookmarks to Supabase
    await upsertAuthors(supabase, includes.users)
    const cardIds = await insertBookmarks(supabase, bookmarks, session.user.id)

    // Create embeddings
    const { data: openAiData, cardIdsWithEmbedding } = await createEmbeddings(clean(bookmarks), cardIds, session.user.id)

    // Insert vectors to pinecone
    const { data: pineconeData } = await insertVectors(cardIdsWithEmbedding, openAiData.data, "cards", session.user.id)
    await supabase.from("logs_errors").insert({ log: pineconeData, user_id: session.user.id })

    if (meta.next_token) {
      // Ingest remaining bookmarks
      await enqueueBookmarks(supabase, meta.next_token, data.id, session.user.id)
    }
    // Add to queue for syncing
    await enqueueBookmarkHead(supabase, bookmarks[0].id, data.id, session.user.id)

    deleteCookie(`${session.user.id}-twitter-OAuth`, cookieOptions)
    
    return res.redirect("/")
  } catch (error) {
    console.log("Error: ", error)

    if (!sync) {
      // Add to queue for syncing
      await enqueueBookmarkHead(supabase, "0", data.id, session.user.id)
      await supabase.from("logs_errors").insert({ error: { error, message: "Might not have bookmarks upon connecting account" }, user_id: session.user.id })
      return res.redirect("/")
    }

    await supabase.from("logs_errors").insert({ error, user_id: session.user.id })
    return res.redirect("/")
  }
}

