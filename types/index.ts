export type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok'
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'question'
export type CommentStatus = 'pending' | 'replied' | 'approved' | 'spam' | 'escalated'
export type SourceType = 'comment' | 'dm'
export type ReplyTone = 'friendly' | 'professional' | 'sales'
export type Language = 'ms' | 'en' | 'id'
export type Plan = 'free' | 'creator' | 'business' | 'agency'

export interface User {
  id: string
  name: string
  email: string
  plan: Plan
  avatarUrl?: string
}

export interface ConnectedAccount {
  id: string
  platform: Platform
  name: string
  handle: string
  pageId?: string
  accessToken?: string
  connected: boolean
  followers: number
  commentsToday: number
  status: 'connected' | 'limited' | 'disconnected'
}

export interface PostContext {
  id: string
  caption: string
  color: string
}

export interface AISuggestion {
  tone: ReplyTone
  text: string
}

export interface Comment {
  id: string
  platform: Platform
  sourceType: SourceType
  username: string
  userInitials: string
  userAvatarUrl?: string
  accountName: string
  text: string
  timestamp: string
  sentiment: Sentiment
  language: Language
  status: CommentStatus
  isRead: boolean
  post?: PostContext
  aiSuggestions: AISuggestion[]
  externalId?: string
}

export interface Notification {
  id: string
  type: 'comment' | 'reply' | 'auto' | 'system' | 'spam'
  title: string
  subtitle: string
  unread: boolean
  group: 'Today' | 'Yesterday' | 'This Week'
  timestamp: string
}

export interface Template {
  id: string
  category: string
  title: string
  body: string
  language: Language
}

export interface AutoRule {
  id: string
  name: string
  desc: string
  on: boolean
}

export interface WeeklyStats {
  day: string
  rate: number
}
