/**
 * Supabase Edge Function: Meta Webhook Handler
 * Deploy: supabase functions deploy meta-webhook
 *
 * Set these secrets:
 *   supabase secrets set META_VERIFY_TOKEN=your-random-verify-token
 *   supabase secrets set META_APP_SECRET=your-meta-app-secret
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VERIFY_TOKEN = Deno.env.get('META_VERIFY_TOKEN') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

Deno.serve(async (req) => {
  const url = new URL(req.url)

  // ── Webhook Verification (GET) ──────────────────────────────────────────
  if (req.method === 'GET') {
    const mode      = url.searchParams.get('hub.mode')
    const token     = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified ✅')
      return new Response(challenge, { status: 200 })
    }
    return new Response('Forbidden', { status: 403 })
  }

  // ── Incoming Events (POST) ──────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = await req.json()
    console.log('Webhook event:', JSON.stringify(body).slice(0, 200))

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {

        // ── New Comment on Facebook/Instagram Post ──────────────────────
        if (change.field === 'feed' || change.field === 'comments') {
          const value = change.value
          if (value?.item === 'comment' && value?.verb === 'add') {
            await handleNewComment({
              externalId:  value.comment_id,
              text:        value.message,
              username:    value.from?.name ?? 'Unknown',
              platform:    'facebook',
              sourceType:  'comment',
              postId:      value.post_id,
              timestamp:   new Date(value.created_time * 1000).toISOString(),
            })
          }
        }

        // ── New Messenger DM ────────────────────────────────────────────
        if (change.field === 'messages') {
          const msg = change.value
          await handleNewComment({
            externalId:  msg.message?.mid ?? msg.sender?.id,
            text:        msg.message?.text ?? '',
            username:    msg.sender?.id ?? 'Unknown',
            platform:    'facebook',
            sourceType:  'dm',
            timestamp:   new Date(msg.timestamp).toISOString(),
          })
        }

        // ── Instagram Comment ───────────────────────────────────────────
        if (change.field === 'comments' && entry.id?.startsWith('17')) {
          const value = change.value
          await handleNewComment({
            externalId: value.id,
            text:       value.text,
            username:   value.from?.username ?? 'ig_user',
            platform:   'instagram',
            sourceType: 'comment',
            postId:     value.media?.id,
            timestamp:  value.timestamp ?? new Date().toISOString(),
          })
        }
      }
    }

    return new Response('OK', { status: 200 })
  }

  return new Response('Method Not Allowed', { status: 405 })
})

// ── Helper: upsert comment into DB ────────────────────────────────────────
async function handleNewComment(data: {
  externalId: string
  text: string
  username: string
  platform: string
  sourceType: string
  postId?: string
  timestamp: string
}) {
  // Find the matching connected account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('id, user_id')
    .eq('platform', data.platform)
    .single()

  if (!account) {
    console.log('No connected account found for platform:', data.platform)
    return
  }

  // Upsert comment (ignore duplicates)
  const { error } = await supabase
    .from('comments')
    .upsert({
      user_id:      account.user_id,
      account_id:   account.id,
      external_id:  data.externalId,
      platform:     data.platform,
      source_type:  data.sourceType,
      username:     data.username,
      user_initials: data.username.slice(0, 2).toUpperCase(),
      text:         data.text,
      status:       'pending',
      post_id:      data.postId,
      timestamp:    data.timestamp,
    }, { onConflict: 'account_id,external_id' })

  if (error) console.error('DB upsert error:', error)
  else console.log('Comment saved:', data.externalId)
}
