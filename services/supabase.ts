import { createClient } from '@supabase/supabase-js'

// ── Fill these in after creating your Supabase project ──────────────────────
// supabase.com → Project Settings → API
const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL  ?? ''
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON ?? ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const signInWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signUpWithEmail = (email: string, password: string, name: string) =>
  supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// ── Database helpers ──────────────────────────────────────────────────────────
export const getComments = (userId: string) =>
  supabase
    .from('comments')
    .select('*, connected_accounts(platform, name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

export const updateCommentStatus = (id: string, status: string) =>
  supabase.from('comments').update({ status }).eq('id', id)

export const insertReply = (commentId: string, text: string, aiGenerated: boolean) =>
  supabase.from('replies').insert({ comment_id: commentId, text, ai_generated: aiGenerated })

export const getConnectedAccounts = (userId: string) =>
  supabase.from('connected_accounts').select('*').eq('user_id', userId)

export const upsertConnectedAccount = (account: Record<string, unknown>) =>
  supabase.from('connected_accounts').upsert(account)
