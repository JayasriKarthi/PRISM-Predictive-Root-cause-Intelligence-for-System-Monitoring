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

// Simulated database storage (in production, this would be a real backend)
const mockUsers: Record<string, User & { password: string }> = {
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

const mockUserSettings: Record<string, SettingsData> = {
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

// Email validation and authentication
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate email format
        if (!email.includes("@")) {
          resolve({
            success: false,
            message: "Invalid email format",
          })
          return
        }

        // Find user by email
        const user = mockUsers[email]
        if (!user) {
          resolve({
            success: false,
            message: "User not found. Please check your email.",
          })
          return
        }

        // Validate password
        if (user.password !== password) {
          resolve({
            success: false,
            message: "Incorrect password. Please try again.",
          })
          return
        }

        // Generate mock token
        const token = btoa(`${email}:${Date.now()}`)

        resolve({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
          },
          token,
        })
      }, 500) // Simulate network delay
    })
  },

  register: async (
    email: string,
    password: string,
    username: string,
    role: "operator" | "admin" = "operator",
  ): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!email.includes("@")) {
          resolve({
            success: false,
            message: "Invalid email format",
          })
          return
        }

        if (mockUsers[email]) {
          resolve({
            success: false,
            message: "Email already registered",
          })
          return
        }

        if (password.length < 6) {
          resolve({
            success: false,
            message: "Password must be at least 6 characters",
          })
          return
        }

        const newUser: User & { password: string } = {
          id: String(Object.keys(mockUsers).length + 1),
          email,
          password,
          username,
          role,
          createdAt: new Date().toISOString(),
        }

        mockUsers[email] = newUser
        mockUserSettings[newUser.id] = {
          username,
          email,
          theme: "dark",
          notifications: {
            emailAlerts: true,
            slackAlerts: true,
            pushNotifications: false,
            weeklyReport: true,
            anomalyNotifications: true,
            systemDowntime: true,
          },
        }

        resolve({
          success: true,
          message: "Registration successful",
          user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
          token: btoa(`${email}:${Date.now()}`),
        })
      }, 500)
    })
  },

  verifyEmail: async (token: string): Promise<boolean> => {
    // Simulated email verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(!!token)
      }, 300)
    })
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
        if (!mockUserSettings[userId]) {
          resolve({
            success: false,
            message: "User settings not found",
          })
          return
        }

        mockUserSettings[userId] = {
          ...mockUserSettings[userId],
          ...settings,
        }

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
  ): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userEmail = Object.keys(mockUsers).find((email) => mockUsers[email].id === userId)
        if (!userEmail) {
          resolve({
            success: false,
            message: "User not found",
          })
          return
        }

        const user = mockUsers[userEmail]
        if (user.password !== oldPassword) {
          resolve({
            success: false,
            message: "Current password is incorrect",
          })
          return
        }

        if (newPassword.length < 6) {
          resolve({
            success: false,
            message: "New password must be at least 6 characters",
          })
          return
        }

        user.password = newPassword
        resolve({
          success: true,
          message: "Password changed successfully",
        })
      }, 400)
    })
  },
}
