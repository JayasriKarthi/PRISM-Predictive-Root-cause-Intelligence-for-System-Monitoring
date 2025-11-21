"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./pages/login-page"
import { Dashboard } from "./pages/dashboard"
import { ApiProvider, useApi } from "./context/api-context"
import { SREProvider } from "./context/sre-context"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ThemeProvider } from "./components/theme-provider"

function AppRoutes() {
  const { user, logout } = useApi()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard/*"
          element={
            <SREProvider>
              <Dashboard userRole={user?.role || "operator"} onLogout={logout} />
            </SREProvider>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ApiProvider>
          <AppRoutes />
        </ApiProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
