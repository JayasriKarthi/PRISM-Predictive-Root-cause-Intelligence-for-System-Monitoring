"use client"

import { Home, BarChart3, Activity, AlertTriangle, FileText, Settings, Menu, X, Users, Server } from "lucide-react"
import { useState } from "react"

interface SidebarNavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "operator" | "admin" | null
  isDarkMode: boolean
  onThemeToggle: () => void
}

export function SidebarNavigation({
  currentPage,
  onPageChange,
  userRole,
  isDarkMode,
  onThemeToggle,
}: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(true)

  const commonNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "containers", label: "Containers", icon: Activity },
    { id: "anomaly", label: "Anomaly", icon: AlertTriangle },
  ]

  const adminNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "sre-management", label: "SRE Management", icon: Users },
    { id: "system-management", label: "System Management", icon: Server },
    { id: "rca-report", label: "RCA Reports", icon: FileText },
  ]

  const otherNavItems = [{ id: "settings", label: "Settings", icon: Settings }]

  const navItems =
    userRole === "admin"
      ? [ ...adminNavItems, ...otherNavItems]
      : [...commonNavItems, { id: "rca-report", label: "RCA Report", icon: FileText }, ...otherNavItems]

  const handleNavClick = (page: string) => {
    onPageChange(page)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-card border border-border rounded-lg text-heading hover:bg-hover transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 md:w-64"
        } overflow-hidden md:relative md:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-lg flex items-center justify-center flex-shrink-0 hover:from-[#C4B5FD] hover:to-[#A78BFA] transition-all hover:scale-110 hover:shadow-lg hover:shadow-violet-500/30">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-heading font-bold text-lg">PRISM Admin</h1>
                <p className="text-xs text-primary font-semibold">{userRole?.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium group ${
                    isActive 
                      ? "bg-hover text-primary border-l-4 border-primary shadow-sm" 
                      : "text-body hover:bg-hover hover:text-primary hover:translate-x-1 hover:shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <button
              onClick={onThemeToggle}
              className="w-full px-3 py-2 text-xs text-body hover:text-primary transition-colors text-left"
            >
              {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <p className="text-xs text-body">© 2025 PRISM Monitor</p>
          </div>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
