import { create } from 'zustand'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isSignedIn: boolean
  setUser: (user: User | null) => void
  setLoading: (v: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: 'mock-user-1',
    name: 'MintG Team',
    email: 'mintg@example.com',
    plan: 'creator',
  },
  isLoading: false,
  isSignedIn: false,
  setUser:    (user)    => set({ user, isSignedIn: !!user }),
  setLoading: (v)       => set({ isLoading: v }),
  signOut:    ()        => set({ user: null, isSignedIn: false }),
}))
