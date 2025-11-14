"use client"

import { useState } from "react"
import { SidebarNavigation } from "../components/sidebar-navigation"
import { HomePage } from "./home-page"
import { AdminHomePage } from "./admin-home-page"
import { MetricsPage } from "./metrics-page"
import { ContainersPage } from "./containers-page"
import { AnomalyPage } from "./anomaly-page"
import { RCAReportPage } from "./rca-report-page"
import { RCAReportsListPage } from "./rca-reports-list-page"
import { SettingsPage } from "./settings-page"
import { SREManagementPage } from "./sre-management-page"
import { SystemManagementPage } from "./system-management-page"
import { ArrowLeft } from "react-feather"

interface DashboardProps {
  userRole: "operator" | "admin" | null
  onLogout: () => void
}

export function Dashboard({ userRole, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [previousPage, setPreviousPage] = useState("home")

  const handlePageChange = (page: string) => {
    if (currentPage !== "containers") {
      setPreviousPage(currentPage)
    }
    setCurrentPage(page)
  }

  const handleBackFromContainers = () => {
    setCurrentPage(previousPage)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return userRole === "admin" ? <AdminHomePage /> : <HomePage />
      case "metrics":
        return <MetricsPage />
      case "containers":
        return <ContainersPage isDarkMode={isDarkMode} />
      case "anomaly":
        return <AnomalyPage />
      case "rca-report":
        return userRole === "admin" ? <RCAReportsListPage /> : <RCAReportPage />
      case "sre-management":
        return <SREManagementPage onNavigate={handlePageChange} />
      case "system-management":
        return <SystemManagementPage />
      case "settings":
        return <SettingsPage onLogout={onLogout} />
      default:
        return userRole === "admin" ? <AdminHomePage /> : <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <SidebarNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        userRole={userRole}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
      <main className="flex-1 md:ml-0">
        {currentPage === "containers" && (
          <div className="absolute top-4 left-4 md:left-80">
            <button
              onClick={handleBackFromContainers}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 z-10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {previousPage.charAt(0).toUpperCase() + previousPage.slice(1)}
            </button>
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  )
}
