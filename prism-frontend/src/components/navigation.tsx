"use client"

import { Home, BarChart3, Activity, AlertTriangle, FileText, Settings } from "lucide-react"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "sre" | "admin" | null
}

export function Navigation({ currentPage, onPageChange, userRole }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "system-status", label: "System Status", icon: Activity },
    { id: "anomaly", label: "Anomaly Page", icon: AlertTriangle },
    { id: "rca-report", label: "RCA Report", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-lg flex items-center justify-center hover:from-[#C4B5FD] hover:to-[#A78BFA] transition-all hover:scale-110 hover:shadow-lg hover:shadow-violet-500/30">
              <span className="text-white font-bold">⚙</span>
            </div>
            <span className="text-heading font-bold text-lg">SRE Monitor</span>
            <span className="ml-4 px-3 py-1 text-xs font-semibold bg-hover border border-primary/50 text-primary rounded-full">
              {userRole?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap relative group ${
                    currentPage === item.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-body hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
