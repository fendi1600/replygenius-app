import axios from 'axios'

const GRAPH_BASE = 'https://graph.facebook.com/v19.0'

/**
 * Meta Graph API service
 * ─────────────────────
 * Setup steps (do these in parallel with development):
 * 1. developers.facebook.com → Create App → Business type
 * 2. Add: Facebook Login, Pages API, Instagram Graph API
 * 3. Get User Access Token with these permissions:
 *    pages_read_engagement, pages_manage_posts, pages_messaging,
 *    instagram_basic, instagram_manage_comments, instagram_manage_messages
 * 4. Exchange for Long-Lived Token (60 days)
 * 5. Store token in Supabase: connected_accounts.access_token
 */

// ── Facebook Pages ────────────────────────────────────────────────────────────

/** Get all Pages the user manages */
export async function getUserPages(userToken: string) {
  const res = await axios.get(`${GRAPH_BASE}/me/accounts`, {
    params: { access_token: userToken, fields: 'id,name,picture,fan_count' },
  })
  return res.data.data as Array<{
    id: string
    name: string
    access_token: string
    picture: { data: { url: string } }
    fan_count: number
  }>
}

/** Get recent post comments for a Page */
export async function getPageComments(pageId: string, pageToken: string, limit = 25) {
  // Get recent posts first
  const posts = await axios.get(`${GRAPH_BASE}/${pageId}/feed`, {
    params: {
      access_token: pageToken,
      fields: 'id,message,created_time',
      limit: 10,
    },
  })

  const comments: MetaComment[] = []

  for (const post of posts.data.data.slice(0, 5)) {
    const res = await axios.get(`${GRAPH_BASE}/${post.id}/comments`, {
      params: {
        access_token: pageToken,
        fields: 'id,message,from,created_time,can_reply_privately',
        limit,
      },
    })
    for (const c of res.data.data ?? []) {
      comments.push({
        id: c.id,
        text: c.message,
        username: c.from?.name ?? 'Unknown',
        userId: c.from?.id ?? '',
        platform: 'facebook',
        sourceType: 'comment',
        postId: post.id,
        postCaption: post.message?.slice(0, 80) ?? '',
        timestamp: c.created_time,
      })
    }
  }

  return comments
}

/** Get Page inbox (Messenger DMs) */
export async function getPageInbox(pageId: string, pageToken: string) {
  const res = await axios.get(`${GRAPH_BASE}/${pageId}/conversations`, {
    params: {
      access_token: pageToken,
      fields: 'id,participants,updated_time,messages{message,from,created_time}',
      platform: 'messenger',
    },
  })
  return res.data.data as Array<{
    id: string
    participants: { data: Array<{ id: string; name: string }> }
    updated_time: string
    messages: { data: Array<{ message: string; from: { id: string; name: string }; created_time: string }> }
  }>
}

/** Reply to a Facebook comment */
export async function replyToComment(commentId: string, message: string, pageToken: string) {
  const res = await axios.post(
    `${GRAPH_BASE}/${commentId}/comments`,
    { message },
    { params: { access_token: pageToken } },
  )
  return res.data as { id: string }
}

/** Send a Messenger message */
export async function sendMessage(recipientId: string, message: string, pageToken: string) {
  const res = await axios.post(
    `${GRAPH_BASE}/me/messages`,
    { recipient: { id: recipientId }, message: { text: message } },
    { params: { access_token: pageToken } },
  )
  return res.data
}

// ── Instagram ─────────────────────────────────────────────────────────────────

/** Get the IG Business Account linked to a Facebook Page */
export async function getIGAccount(pageId: string, pageToken: string) {
  const res = await axios.get(`${GRAPH_BASE}/${pageId}`, {
    params: {
      access_token: pageToken,
      fields: 'instagram_business_account{id,name,username,profile_picture_url,followers_count}',
    },
  })
  return res.data.instagram_business_account as {
    id: string; name: string; username: string
    profile_picture_url: string; followers_count: number
  } | null
}

/** Get recent IG media comments */
export async function getIGComments(igAccountId: string, pageToken: string, limit = 25) {
  const media = await axios.get(`${GRAPH_BASE}/${igAccountId}/media`, {
    params: { access_token: pageToken, fields: 'id,caption,timestamp', limit: 10 },
  })

  const comments: MetaComment[] = []
  for (const post of media.data.data.slice(0, 5)) {
    const res = await axios.get(`${GRAPH_BASE}/${post.id}/comments`, {
      params: {
        access_token: pageToken,
        fields: 'id,text,username,timestamp,replies{id,text,username,timestamp}',
        limit,
      },
    })
    for (const c of res.data.data ?? []) {
      comments.push({
        id: c.id,
        text: c.text,
        username: c.username ?? 'Unknown',
        userId: '',
        platform: 'instagram',
        sourceType: 'comment',
        postId: post.id,
        postCaption: post.caption?.slice(0, 80) ?? '',
        timestamp: c.timestamp,
      })
    }
  }
  return comments
}

/** Reply to an IG comment */
export async function replyToIGComment(commentId: string, message: string, pageToken: string) {
  const res = await axios.post(
    `${GRAPH_BASE}/${commentId}/replies`,
    { message },
    { params: { access_token: pageToken } },
  )
  return res.data as { id: string }
}

/** Get IG DMs (requires instagram_manage_messages + Business Verification) */
export async function getIGMessages(igAccountId: string, pageToken: string) {
  const res = await axios.get(`${GRAPH_BASE}/${igAccountId}/conversations`, {
    params: {
      access_token: pageToken,
      fields: 'id,participants,updated_time,messages{text,from,created_time}',
      platform: 'instagram',
    },
  })
  return res.data.data
}

// ── Webhooks ─────────────────────────────────────────────────────────────────
/**
 * Webhook verification endpoint (implement in your Supabase Edge Function)
 *
 * POST /functions/v1/meta-webhook
 *
 * For GET (verification):
 *   if (req.query['hub.verify_token'] === VERIFY_TOKEN)
 *     return res.send(req.query['hub.challenge'])
 *
 * For POST (new comment/message):
 *   Parse body.entry[].changes[] and upsert into Supabase comments table
 */

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MetaComment {
  id: string
  text: string
  username: string
  userId: string
  platform: 'facebook' | 'instagram'
  sourceType: 'comment' | 'dm'
  postId?: string
  postCaption?: string
  timestamp: string
}
