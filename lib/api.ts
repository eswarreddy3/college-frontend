import axios from "axios"

const TOKEN_KEY = "fynity_access_token"
const AUTH_KEY = "fynity-auth"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.state?.refreshToken ?? null
      }
    } catch { return null }
  }
  return null
}

function updateTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, accessToken)
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.state) {
        parsed.state.token = accessToken
        parsed.state.refreshToken = refreshToken
        localStorage.setItem(AUTH_KEY, JSON.stringify(parsed))
      }
    }
  } catch { /* ignore */ }
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString()
  document.cookie = `fynity_token=${encodeURIComponent(accessToken)};expires=${expires};path=/;SameSite=Lax`
}

function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_KEY)
  document.cookie = "fynity_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
  window.location.href = "/login"
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: ((token: string) => void)[] = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const url = error.config?.url ?? ""
    const status = error.response?.status

    if (status === 401 && !url.includes("/auth/login") && !url.includes("/auth/refresh")) {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearAuth()
        return Promise.reject(error)
      }

      // If a refresh is already in flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            error.config.headers.Authorization = `Bearer ${newToken}`
            resolve(api(error.config))
          })
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
        const { token: newAccess, refreshToken: newRefresh } = res.data
        updateTokens(newAccess, newRefresh)

        // Flush queued requests
        refreshQueue.forEach((cb) => cb(newAccess))
        refreshQueue = []

        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${newAccess}`
        return api(error.config)
      } catch {
        refreshQueue = []
        clearAuth()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
