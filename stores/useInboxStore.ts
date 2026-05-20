import { create } from 'zustand'
import { mockComments } from '../data/mock'
import type { Comment, CommentStatus, Platform, SourceType } from '../types'

interface Filters {
  platform:   Platform | 'all'
  status:     CommentStatus | 'all'
  sourceType: SourceType | 'all'
  search:     string
}

interface InboxStore {
  comments:        Comment[]
  filters:         Filters
  activeCommentId: string | null
  aiPanelOpen:     boolean
  selectedTone:    'friendly' | 'professional' | 'sales'
  editedReply:     string

  setFilter:       <K extends keyof Filters>(key: K, value: Filters[K]) => void
  setActiveComment:(id: string | null) => void
  openAIPanel:     (id: string) => void
  closeAIPanel:    () => void
  setTone:         (tone: 'friendly' | 'professional' | 'sales') => void
  setEditedReply:  (text: string) => void
  sendReply:       (id: string) => void
  markAsSpam:      (id: string) => void
  escalate:        (id: string) => void
  approve:         (id: string) => void

  getFiltered:     () => Comment[]
  getActive:       () => Comment | null
  getPendingCount: () => number
}

export const useInboxStore = create<InboxStore>((set, get) => ({
  comments:        mockComments,
  filters:         { platform: 'all', status: 'pending', sourceType: 'all', search: '' },
  activeCommentId: null,
  aiPanelOpen:     false,
  selectedTone:    'friendly',
  editedReply:     '',

  setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
  setActiveComment: (id) => set({ activeCommentId: id }),

  openAIPanel: (id) => {
    const comment = get().comments.find(c => c.id === id)
    if (!comment) return
    const suggestion = comment.aiSuggestions.find(s => s.tone === get().selectedTone)
    set({ activeCommentId: id, aiPanelOpen: true, editedReply: suggestion?.text ?? '' })
  },

  closeAIPanel: () => set({ aiPanelOpen: false, activeCommentId: null, editedReply: '' }),

  setTone: (tone) => {
    const comment = get().comments.find(c => c.id === get().activeCommentId)
    const suggestion = comment?.aiSuggestions.find(s => s.tone === tone)
    set({ selectedTone: tone, editedReply: suggestion?.text ?? '' })
  },

  setEditedReply: (text) => set({ editedReply: text }),

  sendReply: (id) =>
    set(s => ({
      comments: s.comments.map(c => c.id === id ? { ...c, status: 'replied' as CommentStatus, isRead: true } : c),
      aiPanelOpen: false,
      activeCommentId: null,
      editedReply: '',
    })),

  markAsSpam: (id) =>
    set(s => ({
      comments: s.comments.map(c => c.id === id ? { ...c, status: 'spam' as CommentStatus } : c),
      aiPanelOpen: false,
      activeCommentId: null,
    })),

  escalate: (id) =>
    set(s => ({
      comments: s.comments.map(c => c.id === id ? { ...c, status: 'escalated' as CommentStatus } : c),
    })),

  approve: (id) =>
    set(s => ({
      comments: s.comments.map(c => c.id === id ? { ...c, status: 'approved' as CommentStatus } : c),
    })),

  getFiltered: () => {
    const { comments, filters } = get()
    return comments.filter(c => {
      if (filters.platform   !== 'all' && c.platform   !== filters.platform)   return false
      if (filters.status     !== 'all' && c.status     !== filters.status)     return false
      if (filters.sourceType !== 'all' && c.sourceType !== filters.sourceType) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!c.username.toLowerCase().includes(q) && !c.text.toLowerCase().includes(q)) return false
      }
      return true
    })
  },

  getActive:       () => get().comments.find(c => c.id === get().activeCommentId) ?? null,
  getPendingCount: () => get().comments.filter(c => c.status === 'pending').length,
}))
