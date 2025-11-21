"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, LogOut, Lock, Mail, User, Bell, Loader, Check, Eye, EyeOff } from "lucide-react"
import { useApi } from "../context/api-context"

interface SettingsPageProps {
  onLogout: () => void
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const { user, settings, updateSettings, changePassword, logout, isLoading, error, clearError } = useApi()
  const { theme, setTheme } = useTheme()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    slackAlerts: true,
    pushNotifications: false,
    weeklyReport: true,
    anomalyNotifications: true,
    systemDowntime: true,
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load settings on mount
  useEffect(() => {
    if (settings) {
      // Theme is handled by next-themes, but we can sync if needed. 
      // For now, let's trust next-themes or sync it once.
      // Actually, if user logs in on a new device, we might want to set theme from settings.
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme)
      }
      setUsername(settings.username || user?.username || "")
      setEmail(settings.email || user?.email || "")
      setNotifications(settings.notifications)
    } else if (user) {
      setUsername(user.username || "")
      setEmail(user.email || "")
    }
  }, [settings, user])

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    clearError()
    setTheme(newTheme)
    const success = await updateSettings({ theme: newTheme })
    if (success) {
      setSuccessMessage("Theme updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    clearError()
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    }
    setNotifications(updated)
    const success = await updateSettings({ notifications: updated })
    if (!success) {
      // Revert on error
      setNotifications(notifications)
    } else {
      setSuccessMessage(`${key.replace(/([A-Z])/g, " $1").trim()} updated`)
      setTimeout(() => setSuccessMessage(""), 2000)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setPasswordError("")

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    setIsPasswordLoading(true)
    const success = await changePassword(oldPassword, newPassword)
    setIsPasswordLoading(false)

    if (success) {
      setSuccessMessage("Password changed successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      setPasswordError(error || "Failed to change password")
    }
  }

  const handleUpdateProfile = async () => {
    clearError()
    const success = await updateSettings({ username, email })
    if (success) {
      setSuccessMessage("Profile updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleLogout = () => {
    clearError()
    logout()
    onLogout()
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center gap-4 drop-shadow-2xl tracking-tight">
              <Lock className="w-12 h-12" />
              Settings
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Manage your PRISM account and preferences</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2 shadow-md">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-md">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-card rounded-xl border-2 border-border p-6 mb-6 shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-xl font-semibold text-heading mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">Username</label>
              <input
                type="text"
                value={username}
                readOnly
                disabled
                className="w-full px-4 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body opacity-60 cursor-not-allowed"
              />
            </div>

            {/* Change Password Section */}
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full px-4 py-2 bg-disabled-bg hover:bg-hover text-body border-2 border-border rounded-lg transition-all font-semibold flex items-center justify-center gap-2 hover:border-primary"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3 p-4 bg-hover border-2 border-border rounded-xl">
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isPasswordLoading}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-body hover:text-primary transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isPasswordLoading}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-body hover:text-primary transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isPasswordLoading}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-body hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {passwordError && <p className="text-red-600 text-sm bg-red-50 border-2 border-red-200 p-2 rounded-lg font-medium">{passwordError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] disabled:from-disabled-bg disabled:to-disabled-bg text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0"
                  >
                    {isPasswordLoading && <Loader className="w-3 h-3 animate-spin" />}
                    {isPasswordLoading ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordError("")
                      setOldPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                    className="flex-1 px-3 py-2 bg-disabled-bg hover:bg-hover text-body border-2 border-border rounded-lg font-semibold text-sm transition-all hover:border-primary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Theme Section */}
       
        {/* Logout Section */}
        <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </h2>
          <p className="text-red-700 mb-4">Click below to logout from your PRISM account.</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
