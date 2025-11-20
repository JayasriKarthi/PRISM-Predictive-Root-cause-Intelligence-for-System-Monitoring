"use client"

import type React from "react"

import { useState } from "react"
import { Zap, Server, Shield, Loader } from "lucide-react"
import { useApi } from "../context/api-context"

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export function LoginPage() {
  const { error: contextError, clearError, syncUserFromStorage } = useApi()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [activeRole, setActiveRole] = useState<"SRE" | "ADMIN" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // Decode JWT token to extract user info
  const decodeJWT = (
    token: string,
  ): { sub: string; email: string; role?: string; username?: string } | null => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  const mapRoleToUiRole = (role?: string): "operator" | "admin" => {
    if (role?.toUpperCase() === "ADMIN") {
      return "admin"
    }
    return "operator"
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setLocalError("")
    clearError()
  }

  const handleRoleSelect = (role: "SRE" | "ADMIN") => {
    setActiveRole(role)
    setLocalError("")
    clearError()
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setIsLoading(true)

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = "Invalid email or password"
        try {
          const errorData = await response.json()
          if (errorData && typeof errorData === "object" && "detail" in errorData) {
            errorMessage = typeof errorData.detail === "string" ? errorData.detail : "Login failed"
          }
        } catch (parseError) {
          // If JSON parsing fails, use default message
          errorMessage = `Login failed: ${response.status} ${response.statusText}`
        }
        setLocalError(errorMessage)
        setIsLoading(false)
        return
      }

      const data: LoginResponse = await response.json()

      // Validate response has required fields
      if (!data.access_token || !data.refresh_token) {
        setLocalError("Invalid response from server")
        setIsLoading(false)
        return
      }

      // Save tokens to localStorage
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)

      // Decode token to get user info
      const tokenPayload = decodeJWT(data.access_token)
      if (tokenPayload) {
        const userData = {
          id: tokenPayload.sub,
          email: tokenPayload.email,
          username: tokenPayload.username ?? tokenPayload.email.split("@")[0],
          role: mapRoleToUiRole(tokenPayload.role),
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem("user", JSON.stringify(userData))

        // Sync user state in context to trigger re-render
        syncUserFromStorage()
      } else {
        // If token decode fails, still sync from storage and reload
        syncUserFromStorage()
        window.location.reload()
      }
    } catch (error) {
      console.error("Login error:", error)
      setLocalError("Failed to connect to server. Please check if the backend is running.")
    } finally {
      setIsLoading(false)
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

    setIsRegistering(true)
    try {
      const endpointRole = activeRole === "ADMIN" ? "admin" : "sre"
      const response = await fetch(`http://localhost:8000/api/v1/auth/register/${endpointRole}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      })

      if (!response.ok) {
        let errorMessage = "Registration failed"
        try {
          const errorData = await response.json()
          if (errorData && typeof errorData === "object" && "detail" in errorData) {
            errorMessage = typeof errorData.detail === "string" ? errorData.detail : "Registration failed"
          }
        } catch {
          errorMessage = `Registration failed: ${response.status} ${response.statusText}`
        }
        setLocalError(errorMessage)
        return
      }

      const data: LoginResponse = await response.json()
      if (!data.access_token || !data.refresh_token) {
        setLocalError("Invalid response from server")
        return
      }

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)

      const tokenPayload = decodeJWT(data.access_token)
      if (tokenPayload) {
        const userData = {
          id: tokenPayload.sub,
          email: tokenPayload.email,
          username: tokenPayload.username ?? username.trim(),
          role: mapRoleToUiRole(tokenPayload.role),
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem("user", JSON.stringify(userData))
        syncUserFromStorage()
      } else {
        syncUserFromStorage()
        window.location.reload()
      }

      setEmail("")
      setPassword("")
      setUsername("")
      setConfirmPassword("")
      setActiveRole(null)
    } catch (error) {
      console.error("Registration error:", error)
      setLocalError("Failed to connect to server. Please check if the backend is running.")
    } finally {
      setIsRegistering(false)
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

            {(localError || contextError) && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{localError || contextError}</p>
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
                  onClick={() => handleRoleSelect("SRE")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    activeRole === "SRE"
                      ? "border-primary bg-hover text-primary shadow-md"
                      : "border-border bg-card text-body hover:border-primary hover:text-primary hover:bg-hover hover:shadow-md hover:scale-105"
                  }`}
                >
                  <Server className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xs font-semibold">SRE</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("ADMIN")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    activeRole === "ADMIN"
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
                disabled={isRegistering}
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
                disabled={isRegistering}
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
                disabled={isRegistering}
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
                disabled={isRegistering}
              />
            </div>

            {(localError || contextError) && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{localError || contextError}</p>
            )}

            <button
              type="submit"
              disabled={isRegistering || !activeRole}
              className="w-full py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] disabled:from-disabled-bg disabled:to-disabled-bg disabled:text-disabled-text text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isRegistering && <Loader className="w-4 h-4 animate-spin" />}
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
