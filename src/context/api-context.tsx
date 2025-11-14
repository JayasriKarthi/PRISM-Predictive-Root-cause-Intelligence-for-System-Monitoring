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
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SettingsData | null>(null)

  const clearError = useCallback(() => setError(null), [])

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

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setSettings(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }, [])

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
        const response = await settingsAPI.changePassword(user.id, oldPassword, newPassword)

        if (response.success) {
          setError(null)
          return true
        } else {
          setError(response.message)
          return false
        }
      } catch (err) {
        setError("Failed to change password")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [user],
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
