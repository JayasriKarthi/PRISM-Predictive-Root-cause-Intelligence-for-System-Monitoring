"use client"

import { useState, useEffect } from "react"
import { Server, AlertTriangle, CheckCircle, XCircle, ToggleLeft, ToggleRight, Loader } from "lucide-react"
import { useSRE } from "../context/sre-context"

export function SystemManagementPage() {
  const { systems, isLoading, error, loadSystems, updateSystem, clearError } = useSRE()
  const [selectedSystem, setSelectedSystem] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Load systems on mount
  useEffect(() => {
    loadSystems()
  }, [loadSystems])

  // Set first system as selected by default
  useEffect(() => {
    if (systems.length > 0 && !selectedSystem) {
      setSelectedSystem(systems[0])
    }
  }, [systems, selectedSystem])

  const toggleMonitoring = async (id: string) => {
    clearError()
    setIsUpdating(true)
    const newStatus = selectedSystem?.status === "operational" ? "degraded" : "operational"
    const success = await updateSystem(id, { status: newStatus })
    setIsUpdating(false)
    if (success && selectedSystem) {
      setSelectedSystem({ ...selectedSystem, status: newStatus })
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-300" }
      case "warning":
        return { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-300" }
      case "critical":
        return { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-300" }
      default:
        return { bg: "bg-slate-500/20", border: "border-slate-500/50", text: "text-slate-300" }
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center gap-4 drop-shadow-2xl tracking-tight">
              <Server className="w-12 h-12" />
              System Management
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Monitor and manage all systems</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">{error}</div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Total Systems</p>
            <p className="text-3xl font-bold text-heading">{systems.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Healthy</p>
            <p className="text-3xl font-bold text-primary">
              {systems.filter((s) => s.status === "operational").length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Warnings</p>
            <p className="text-3xl font-bold text-secondary">{systems.filter((s) => s.status === "degraded").length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Critical</p>
            <p className="text-3xl font-bold text-red-600">{systems.filter((s) => s.status === "down").length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Systems List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-hover border-b border-border">
                <h2 className="font-semibold text-heading">Systems</h2>
              </div>
              <div className="overflow-y-auto max-h-96">
                {isLoading && systems.length === 0 ? (
                  <div className="p-4 text-center text-body flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-primary" />
                    Loading...
                  </div>
                ) : systems.length === 0 ? (
                  <div className="p-4 text-center text-body">No systems found</div>
                ) : (
                  systems.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setSelectedSystem(system)}
                      disabled={isLoading}
                      className={`w-full text-left px-4 py-3 border-b border-border transition-all hover:bg-hover disabled:opacity-50 ${
                        selectedSystem?.id === system.id ? "bg-hover border-l-4 border-primary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-heading text-sm">{system.name}</p>
                          <p className="text-xs text-body mt-1">{system.description}</p>
                        </div>
                        <div
                          className={`inline-block w-3 h-3 rounded-full ${
                            system.status === "operational"
                              ? "bg-primary"
                              : system.status === "degraded"
                                ? "bg-secondary"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* System Details */}
          {selectedSystem && (
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6 shadow-lg hover:border-primary transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-heading">{selectedSystem.name}</h2>
                    <p className="text-body text-sm mt-1">{selectedSystem.description}</p>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedSystem.status === "operational"
                        ? "bg-hover border border-primary text-primary"
                        : selectedSystem.status === "degraded"
                          ? "bg-amber-50 border border-amber-200 text-amber-600"
                          : "bg-red-50 border border-red-200 text-red-600"
                    }`}
                  >
                    {selectedSystem.status.charAt(0).toUpperCase() + selectedSystem.status.slice(1)}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-2 font-medium">Status</p>
                    <p
                      className={`text-2xl font-bold ${
                        selectedSystem.status === "operational" ? "text-primary" : "text-body"
                      }`}
                    >
                      {selectedSystem.status === "operational" ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-2 font-medium">Last Updated</p>
                    <p className="text-xl font-bold text-primary">
                      {new Date(selectedSystem.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Monitoring Toggle */}
                <div className="flex items-center justify-between p-4 bg-hover rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-heading">Monitoring Status</p>
                    <p className="text-sm text-body">Toggle system monitoring on/off</p>
                  </div>
                  <button
                    onClick={() => toggleMonitoring(selectedSystem.id)}
                    disabled={isUpdating}
                    className="text-2xl disabled:opacity-50 transition-opacity"
                  >
                    {selectedSystem.status === "operational" ? (
                      <>
                        {isUpdating ? (
                          <Loader className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                          <ToggleRight className="w-8 h-8 text-primary" />
                        )}
                      </>
                    ) : (
                      <>
                        {isUpdating ? (
                          <Loader className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-disabled-text" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
