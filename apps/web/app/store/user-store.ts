import { create } from 'zustand'

type User = {
  name: string
  email: string
  id: string
  avatar?: string
  createdAt: string
  role?: string
}

type UserStore = {
  user: User | null
  counter: string
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  counter: 'eeee444',
}))
