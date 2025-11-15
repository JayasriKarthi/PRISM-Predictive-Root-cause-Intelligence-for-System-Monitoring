"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, LogOut, Lock, Mail, User, Bell, Loader, Check } from "lucide-react"
import { useApi } from "../context/api-context"

interface SettingsPageProps {
  onLogout: () => void
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const { settings, updateSettings, changePassword, logout, isLoading, error, clearError } = useApi()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
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

  // Load settings on mount
  useEffect(() => {
    if (settings) {
      setTheme(settings.theme)
      setUsername(settings.username)
      setEmail(settings.email)
      setNotifications(settings.notifications)
    }
  }, [settings])

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    clearError()
    setTheme(newTheme)
    const success = await updateSettings({ theme: newTheme })
    if (success) {
      setSuccessMessage("Theme updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
      if (newTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark")
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        document.documentElement.classList.remove("dark")
      }
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
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] disabled:from-disabled-bg disabled:to-disabled-bg text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Updating..." : "Save Profile"}
            </button>

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
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-heading mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isPasswordLoading}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
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

        {/* Notification Preferences */}
        <div className="bg-card rounded-xl border-2 border-border p-6 mb-6 shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-xl font-semibold text-heading mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </h2>

          <div className="space-y-3">
            {/* Email Alerts */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">Email Alerts</p>
                <p className="text-sm text-body">Receive critical alerts via email</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("emailAlerts")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.emailAlerts ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.emailAlerts ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Slack Alerts */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">Slack Alerts</p>
                <p className="text-sm text-body">Send alerts to your Slack channel</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("slackAlerts")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.slackAlerts ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.slackAlerts ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">Push Notifications</p>
                <p className="text-sm text-body">Get real-time browser notifications</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("pushNotifications")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.pushNotifications ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.pushNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Weekly Report */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">Weekly Report</p>
                <p className="text-sm text-body">Receive weekly system summary</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("weeklyReport")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.weeklyReport ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.weeklyReport ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Anomaly Notifications */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">Anomaly Alerts</p>
                <p className="text-sm text-body">Get notified on detected anomalies</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("anomalyNotifications")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.anomalyNotifications ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.anomalyNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* System Downtime */}
            <div className="flex items-center justify-between p-4 bg-hover border-2 border-border rounded-xl hover:border-primary transition-all">
              <div>
                <p className="font-medium text-heading">System Downtime Alerts</p>
                <p className="text-sm text-body">Critical alerts for service outages</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("systemDowntime")}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all border-2 hover:scale-105 ${
                  notifications.systemDowntime ? "bg-primary border-primary shadow-md shadow-primary/30" : "bg-disabled-bg border-border hover:border-primary/50"
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    notifications.systemDowntime ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-card rounded-xl border-2 border-border p-6 mb-6 shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-xl font-semibold text-heading mb-6 flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            Theme
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              disabled={isLoading}
              className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 ${
                theme === "light"
                  ? "border-amber-400 bg-amber-50 shadow-md"
                  : "border-border bg-hover hover:border-amber-300"
              }`}
            >
              <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === "light" ? "text-amber-600" : "text-body"}`} />
              <p className={`font-semibold text-sm ${theme === "light" ? "text-amber-700" : "text-body"}`}>Light Theme</p>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              disabled={isLoading}
              className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 ${
                theme === "dark"
                  ? "border-primary bg-hover shadow-md"
                  : "border-border bg-hover hover:border-primary"
              }`}
            >
              <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === "dark" ? "text-primary" : "text-body"}`} />
              <p className={`font-semibold text-sm ${theme === "dark" ? "text-primary" : "text-body"}`}>Dark Theme</p>
            </button>
          </div>
        </div>

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
