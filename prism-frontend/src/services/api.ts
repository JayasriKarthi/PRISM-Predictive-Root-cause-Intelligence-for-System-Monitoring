// This acts as the backend service layer for the frontend application

export interface User {
  id: string
  email: string
  username: string
  role: "operator" | "admin"
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface SettingsData {
  username: string
  email: string
  theme: "light" | "dark"
  notifications: {
    emailAlerts: boolean
    slackAlerts: boolean
    pushNotifications: boolean
    weeklyReport: boolean
    anomalyNotifications: boolean
    systemDowntime: boolean
  }
}

// Helper to manage mock database in localStorage
const STORAGE_KEYS = {
  USERS: "prism_mock_users",
  SETTINGS: "prism_mock_settings",
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e)
    return defaultValue
  }
}

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e)
  }
}

// Default mock data
const defaultUsers: Record<string, User & { password: string }> = {
  "demo@example.com": {
    id: "1",
    email: "demo@example.com",
    password: "demo123",
    username: "demo.user",
    role: "operator",
    createdAt: new Date().toISOString(),
  },
  "admin@example.com": {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    username: "admin.user",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
}

const defaultSettings: Record<string, SettingsData> = {
  "1": {
    username: "demo.user",
    email: "demo@example.com",
    theme: "dark",
    notifications: {
      emailAlerts: true,
      slackAlerts: true,
      pushNotifications: false,
      weeklyReport: true,
      anomalyNotifications: true,
      systemDowntime: true,
    },
  },
  "2": {
    username: "admin.user",
    email: "admin@example.com",
    theme: "dark",
    notifications: {
      emailAlerts: true,
      slackAlerts: true,
      pushNotifications: false,
      weeklyReport: true,
      anomalyNotifications: true,
      systemDowntime: true,
    },
  },
}

// Initialize state from storage or defaults
const mockUsers = loadFromStorage(STORAGE_KEYS.USERS, defaultUsers)
const mockUserSettings = loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings)

// Email validation and authentication
// Helper to decode JWT
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Email validation and authentication
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || "Login failed",
        }
      }

      const { access_token } = data
      const decoded = parseJwt(access_token)

      if (!decoded) {
        return { success: false, message: "Invalid token received" }
      }

      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role.toLowerCase(),
        createdAt: new Date().toISOString(), // Backend doesn't send this in token, using current time or we could fetch profile
      }

      return {
        success: true,
        message: "Login successful",
        user,
        token: access_token,
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Failed to connect to server" }
    }
  },

  register: async (
    email: string,
    password: string,
    username: string,
    role: "operator" | "admin" = "operator",
  ): Promise<AuthResponse> => {
    try {
      // Determine endpoint based on role
      const endpoint = role === "admin" ? "register/admin" : "register/sre" // Assuming 'operator' maps to SRE or similar. 
      // Wait, backend has /register/sre and /register/admin. 
      // Let's assume 'operator' -> 'sre' for now based on previous context, or check routes.py.
      // routes.py has /register/sre and /register/admin.

      const url = `http://localhost:8000/api/v1/auth/${role === "admin" ? "register/admin" : "register/sre"}`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || "Registration failed",
        }
      }

      const { access_token } = data
      const decoded = parseJwt(access_token)

      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role.toLowerCase(),
        createdAt: new Date().toISOString(),
      }

      return {
        success: true,
        message: "Registration successful",
        user,
        token: access_token,
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Failed to connect to server" }
    }
  },

  validateToken: (token: string): boolean => {
    const decoded = parseJwt(token)
    if (!decoded) return false
    // Check expiration if present
    if (decoded.exp && Date.now() >= decoded.exp * 1000) return false
    return true
  },

  getMe: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { success: false, message: "Session invalid" }
      }

      const data = await response.json()
      const user: User = {
        id: String(data.id),
        email: data.email,
        username: data.username,
        role: data.role.toLowerCase(),
        createdAt: new Date().toISOString(),
      }

      return { success: true, message: "Valid session", user }
    } catch (error) {
      return { success: false, message: "Failed to verify session" }
    }
  },

  verifyEmail: async (token: string): Promise<boolean> => {
    // Placeholder as backend might not have this yet
    return true
  },
}

// Settings management API
export const settingsAPI = {
  getSettings: async (userId: string): Promise<SettingsData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserSettings[userId] || null)
      }, 300)
    })
  },

  updateSettings: async (
    userId: string,
    settings: Partial<SettingsData>,
  ): Promise<{ success: boolean; data?: SettingsData; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // If settings don't exist for this user (e.g. new real user), create them
        if (!mockUserSettings[userId]) {
          mockUserSettings[userId] = {
            username: "User",
            email: "user@example.com",
            theme: "light",
            notifications: {
              emailAlerts: true,
              slackAlerts: false,
              pushNotifications: false,
              weeklyReport: true,
              anomalyNotifications: true,
              systemDowntime: true,
            },
            ...settings // Apply the updates immediately
          }
        } else {
          mockUserSettings[userId] = {
            ...mockUserSettings[userId],
            ...settings,
          }
        }

        saveToStorage(STORAGE_KEYS.SETTINGS, mockUserSettings)

        resolve({
          success: true,
          data: mockUserSettings[userId],
          message: "Settings updated successfully",
        })
      }, 400)
    })
  },

  changePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    token?: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const authToken = token || localStorage.getItem("access_token")
      if (!authToken) {
        return { success: false, message: "Not authenticated" }
      }

      const response = await fetch("http://localhost:8000/api/v1/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.detail || "Failed to change password",
        }
      }

      return { success: true, message: "Password changed successfully" }
    } catch (error) {
      console.error("Change password error:", error)
      return { success: false, message: "Failed to connect to server" }
    }
  },
}
