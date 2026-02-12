import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  avatarUrl?: string
  role: 'passenger' | 'driver' | 'admin'
  isVerified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  hasSeenOnboarding: boolean

  // Actions
  setUser: (user: User | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setHasSeenOnboarding: (value: boolean) => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      refreshToken: null,
      hasSeenOnboarding: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      login: (user, accessToken, refreshToken) => set({
        user,
        isAuthenticated: true,
        accessToken,
        refreshToken,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),

      setLoading: (isLoading) => set({ isLoading }),

      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),

      initializeAuth: async () => {
        // Check stored auth state
        const state = get()
        if (state.accessToken && state.user) {
          set({ isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return (rehydratedState) => {
          if (rehydratedState) {
            rehydratedState.setLoading(false)
          }
        }
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
)
