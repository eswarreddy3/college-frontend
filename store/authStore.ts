import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "student" | "college_admin" | "super_admin"

export interface User {
  id: string | number
  name: string
  email: string
  role: UserRole
  college_id?: string | number
  college_name?: string
  first_login: boolean
  branch?: string
  section?: string
  roll_number?: string
  passout_year?: string | number
  phone?: string
  linkedin_url?: string
  points: number
  streak: number
  email_notifications?: boolean
  assignment_reminders?: boolean
  leaderboard_updates?: boolean
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  setAuth: (token: string, refreshToken: string, user: User) => void
  clearAuth: () => void
  updateUser: (partial: Partial<User>) => void
}

const TOKEN_KEY = "fynity_access_token"

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,

      setAuth: (token, refreshToken, user) => {
        // Store token as plain string for reliable cross-navigation access
        if (typeof window !== "undefined") {
          localStorage.setItem(TOKEN_KEY, token)
        }
        setCookie("fynity_token", token)
        set({ token, refreshToken, user })
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY)
        }
        deleteCookie("fynity_token")
        set({ token: null, refreshToken: null, user: null })
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "fynity-auth",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)
