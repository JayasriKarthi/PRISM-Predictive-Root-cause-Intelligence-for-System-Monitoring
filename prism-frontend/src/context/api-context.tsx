"use client"

import { createContext, useContext, type ReactNode, useState, useCallback } from "react"
import { authAPI, settingsAPI, type User, type SettingsData } from "../services/api"

interface ApiContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  settings: SettingsData | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string, role?: "operator" | "admin") => Promise<boolean>
  logout: () => void
  loadSettings: (userId: string) => Promise<void>
  updateSettings: (updates: Partial<SettingsData>) => Promise<boolean>
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
  clearError: () => void
  syncUserFromStorage: () => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  // Initialize user from localStorage if available
  const getUserFromStorage = (): User | null => {
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token")
      console.log("Checking token from storage:", token ? "Found" : "Not Found")

      if (!token) return null

      const isValid = authAPI.validateToken(token)
      console.log("Token validation result:", isValid)

      if (!isValid) {
        console.log("Token invalid, clearing storage")
        // Clear invalid session
        localStorage.removeItem("user")
        localStorage.removeItem("access_token")
        localStorage.removeItem("auth_token")
        return null
      }
      const userStr = localStorage.getItem("user")
      if (userStr) {
        return JSON.parse(userStr)
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
    }
    return null
  }

  const [user, setUser] = useState<User | null>(getUserFromStorage())
  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token") || localStorage.getItem("auth_token"))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SettingsData | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setSettings(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }, [])

  // Sync user from localStorage (useful after login)
  const syncUserFromStorage = useCallback(async () => {
    const storedUser = getUserFromStorage()
    const storedToken = localStorage.getItem("access_token") || localStorage.getItem("auth_token")

    if (storedToken && storedUser) {
      // Verify with backend
      const response = await authAPI.getMe(storedToken)
      if (!response.success) {
        console.log("Backend rejected token, logging out")
        logout()
        return
      }
      // Update user with fresh data from backend
      if (response.user) {
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
      } else {
        setUser(storedUser)
      }
      setToken(storedToken)
    } else {
      setUser(null)
      setToken(null)
    }
  }, [logout])

  // Check session on mount
  useState(() => {
    syncUserFromStorage()
  })

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(email, password)

      if (response.success && response.user && response.token) {
        setUser(response.user)
        setToken(response.token)
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))

        // Load user settings after successful login
        await loadSettings(response.user.id)

        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("An error occurred during login")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (
      email: string,
      password: string,
      username: string,
      role: "operator" | "admin" = "operator",
    ): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authAPI.register(email, password, username, role)

        if (response.success && response.user && response.token) {
          setUser(response.user)
          setToken(response.token)
          localStorage.setItem("auth_token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))

          await loadSettings(response.user.id)

          return true
        } else {
          setError(response.message)
          return false
        }
      } catch (err) {
        setError("An error occurred during registration")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )



  const loadSettings = useCallback(async (userId: string) => {
    try {
      const data = await settingsAPI.getSettings(userId)
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      console.error("Failed to load settings:", err)
    }
  }, [])

  const updateSettings = useCallback(
    async (updates: Partial<SettingsData>): Promise<boolean> => {
      if (!user) return false

      setIsLoading(true)
      setError(null)

      try {
        const response = await settingsAPI.updateSettings(user.id, updates)

        if (response.success && response.data) {
          setSettings(response.data)
          return true
        } else {
          setError(response.message)
          return false
        }
      } catch (err) {
        setError("Failed to update settings")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [user],
  )

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      if (!user) return false

      setIsLoading(true)
      setError(null)

      try {
        const response = await settingsAPI.changePassword(user.id, oldPassword, newPassword, token || undefined)

        if (response.success) {
          setError(null)
          return true
        } else {
          if (response.message.toLowerCase().includes("expired") || response.message.toLowerCase().includes("invalid token")) {
            setError("Session expired. Please logout and login again.")
          } else {
            setError(response.message)
          }
          return false
        }
      } catch (err) {
        setError("Failed to change password")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [user, token],
  )

  return (
    <ApiContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        settings,
        login,
        register,
        logout,
        loadSettings,
        updateSettings,
        changePassword,
        clearError,
        syncUserFromStorage,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within ApiProvider")
  }
  return context
}
