"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Clock, HardDrive, Wifi } from "lucide-react"

interface Container {
  id: string
  name: string
  status: "active" | "inactive"
  value: number
  unit: string
  icon: React.ReactNode
  details: string[]
}

const containers: Container[] = [
  {
    id: "cpu",
    name: "CPU Usage",
    status: "active",
    value: 68,
    unit: "%",
    icon: <div className="text-blue-400">⚙️</div>,
    details: ["Current: 68%", "Average: 55%", "Peak: 92%", "Cores: 8/8 active"],
  },
  {
    id: "memory",
    name: "Memory",
    status: "active",
    value: 72,
    unit: "%",
    icon: <div className="text-purple-400">💾</div>,
    details: ["Used: 14.4/20GB", "Available: 5.6GB", "Buffers: 2.1GB", "Cached: 3.2GB"],
  },
  {
    id: "system",
    name: "System Usage",
    status: "active",
    value: 65,
    unit: "%",
    icon: <HardDrive className="w-5 h-5 text-amber-400" />,
    details: ["Processes: 245", "Threads: 1,234", "Load: 4.5", "Uptime: 89d 14h"],
  },
  {
    id: "started",
    name: "Last Started",
    status: "active",
    value: 89,
    unit: "d",
    icon: <Clock className="w-5 h-5 text-green-400" />,
    details: ["89 days, 14 hours, 32 minutes", "Start time: 2024-08-01 09:15:42", "Restarts: 2", "Unplanned: 0"],
  },
  {
    id: "network",
    name: "Network",
    status: "active",
    value: 45,
    unit: "Mbps",
    icon: <Wifi className="w-5 h-5 text-cyan-400" />,
    details: ["In: 32.4 Mbps", "Out: 12.6 Mbps", "Packets: 2.4M", "Errors: 0"],
  },
  {
    id: "disk",
    name: "Disk Space",
    status: "active",
    value: 58,
    unit: "%",
    icon: <div className="text-orange-400">💿</div>,
    details: ["Used: 232GB / 400GB", "Available: 168GB", "I/O: 2.1MB/s", "Temperature: 42°C"],
  },
]

export function SystemStatusPage() {
  const [selectedContainer, setSelectedContainer] = useState<string | null>("cpu")

  const selected = containers.find((c) => c.id === selectedContainer)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
        <p className="text-slate-400 mb-8">Real-time container and system resource monitoring</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-2">
              {containers.map((container) => (
                <button
                  key={container.id}
                  onClick={() => setSelectedContainer(container.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedContainer === container.id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="font-medium">{container.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          {selected && (
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl">
                    {selected.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                    <p className="text-slate-400">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Active
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Current Status</span>
                    <span className="text-3xl font-bold text-blue-400">
                      {selected.value}
                      {selected.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${selected.value}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selected.details.map((detail, idx) => (
                    <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <p className="text-slate-400 text-sm">{detail.split(":")[0]}</p>
                      <p className="text-white font-semibold text-lg">{detail.split(":")[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
