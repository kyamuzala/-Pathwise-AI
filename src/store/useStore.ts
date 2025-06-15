import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  age: number
  interests: string[]
  skills: string[]
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  addInterest: (interest: string) => void
  addSkill: (skill: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      addInterest: (interest) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, interests: [...state.user.interests, interest] }
            : null,
        })),
      addSkill: (skill) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, skills: [...state.user.skills, skill] }
            : null,
        })),
    }),
    {
      name: 'pathwise-storage',
    }
  )
) 