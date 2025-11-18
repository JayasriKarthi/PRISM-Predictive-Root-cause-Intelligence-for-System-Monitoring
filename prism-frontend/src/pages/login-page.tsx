"use client"

import type React from "react"

import { useState } from "react"
import { Zap, Server, Shield, Loader } from "lucide-react"
import { useApi } from "../context/api-context"

export function LoginPage() {
  const { login, register, isLoading, error, clearError } = useApi()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [activeRole, setActiveRole] = useState<"operator" | "admin" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setLocalError("")
    clearError()
  }

  const handleRoleSelect = (role: "operator" | "admin") => {
    setActiveRole(role)
    setLocalError("")
    clearError()
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password")
      return
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address")
      return
    }

    const success = await login(email, password)
    if (!success) {
      // Error is set by the API context
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!activeRole) {
      setLocalError("Please select a role")
      return
    }

    if (!email.trim() || !password.trim() || !username.trim()) {
      setLocalError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    const success = await register(email, password, username, activeRole)
    if (success) {
      // Successfully registered and logged in
      setEmail("")
      setPassword("")
      setUsername("")
      setConfirmPassword("")
      setActiveRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 space-y-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block p-3 bg-hover rounded-lg mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-heading mb-2">PRISM Monitor</h1>
          <p className="text-body">Predictive Root-cause Intelligence for System Monitoring</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("login")
              setLocalError("")
              clearError()
            }}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === "login" ? "text-primary border-b-2 border-primary" : "text-body hover:text-primary"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("register")
              setLocalError("")
              clearError()
            }}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === "register"
                ? "text-primary border-b-2 border-primary"
                : "text-body hover:text-primary"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            {(localError || error) && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{localError || error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] disabled:from-disabled-bg disabled:to-disabled-bg disabled:text-disabled-text text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-heading mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("operator")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    activeRole === "operator"
                      ? "border-primary bg-hover text-primary shadow-md"
                      : "border-border bg-card text-body hover:border-primary hover:text-primary hover:bg-hover hover:shadow-md hover:scale-105"
                  }`}
                >
                  <Server className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xs font-semibold">SRE</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("admin")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    activeRole === "admin"
                      ? "border-primary bg-hover text-primary shadow-md"
                      : "border-border bg-card text-body hover:border-primary hover:text-primary hover:bg-hover hover:shadow-md hover:scale-105"
                  }`}
                >
                  <Shield className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xs font-semibold">Admin</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your.username"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading}
              />
            </div>

            {(localError || error) && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{localError || error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !activeRole}
              className="w-full py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] disabled:from-disabled-bg disabled:to-disabled-bg disabled:text-disabled-text text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Demo Credentials */}
        <div className="p-4 bg-hover rounded-xl border border-border">
          <p className="text-xs font-semibold text-body uppercase mb-2">Demo Credentials:</p>
          <p className="text-sm text-foreground mb-2">
            SRE: <span className="text-primary">demo@example.com</span> /<span className="text-primary">demo123</span>
          </p>
          <p className="text-sm text-foreground">
            Admin: <span className="text-primary">admin@example.com</span> /
            <span className="text-primary">admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
