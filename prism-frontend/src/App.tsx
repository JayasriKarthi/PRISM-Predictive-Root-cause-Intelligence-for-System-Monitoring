"use client"

import { useState, useEffect } from "react"
import { LoginPage } from "./pages/login-page"
import { Dashboard } from "./pages/dashboard"
import { ApiProvider, useApi } from "./context/api-context"
import { SREProvider } from "./context/sre-context"

function AppContent() {
  const { user, logout } = useApi()
  const [isLoggedIn, setIsLoggedIn] = useState(!!user)

  useEffect(() => {
    setIsLoggedIn(!!user)
  }, [user])

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <SREProvider>
      <Dashboard userRole={user?.role || "operator"} onLogout={logout} />
    </SREProvider>
  )
}

export default function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  )
}
