"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChevronRight, Zap, TrendingUp, ArrowLeft } from "lucide-react"

interface Container {
  id: string
  name: string
  status: "active" | "inactive"
  cpu: number
  memory: number
  disk: number
  network: number
  lastStarted: string
  uptime: number
}

interface MetricsData {
  time: string
  cpu: number
  memory: number
  disk: number
  network: number
}

const initialContainers: Container[] = [
  {
    id: "container-1",
    name: "API Server",
    status: "active",
    cpu: 45,
    memory: 62,
    disk: 58,
    network: 32,
    lastStarted: "89d 14h",
    uptime: 89,
  },
  {
    id: "container-2",
    name: "Database",
    status: "active",
    cpu: 72,
    memory: 85,
    disk: 78,
    network: 48,
    lastStarted: "45d 22h",
    uptime: 45,
  },
  {
    id: "container-3",
    name: "Cache Service",
    status: "active",
    cpu: 28,
    memory: 42,
    disk: 35,
    network: 15,
    lastStarted: "120d 6h",
    uptime: 120,
  },
  {
    id: "container-4",
    name: "Message Queue",
    status: "inactive",
    cpu: 0,
    memory: 0,
    disk: 22,
    network: 0,
    lastStarted: "5d 3h",
    uptime: 0,
  },
  {
    id: "container-5",
    name: "Search Engine",
    status: "active",
    cpu: 58,
    memory: 71,
    disk: 65,
    network: 42,
    lastStarted: "30d 12h",
    uptime: 30,
  },
  {
    id: "container-6",
    name: "Worker Pool",
    status: "active",
    cpu: 35,
    memory: 48,
    disk: 41,
    network: 22,
    lastStarted: "60d 8h",
    uptime: 60,
  },
  {
    id: "container-7",
    name: "Analytics",
    status: "active",
    cpu: 62,
    memory: 68,
    disk: 72,
    network: 38,
    lastStarted: "15d 18h",
    uptime: 15,
  },
  {
    id: "container-8",
    name: "CDN Gateway",
    status: "active",
    cpu: 38,
    memory: 52,
    disk: 48,
    network: 85,
    lastStarted: "75d 2h",
    uptime: 75,
  },
  {
    id: "container-9",
    name: "Auth Service",
    status: "active",
    cpu: 42,
    memory: 55,
    disk: 45,
    network: 28,
    lastStarted: "22d 10h",
    uptime: 22,
  },
  {
    id: "container-10",
    name: "Logger Service",
    status: "active",
    cpu: 51,
    memory: 64,
    disk: 78,
    network: 35,
    lastStarted: "12d 5h",
    uptime: 12,
  },
]

const generateMetricsData = (): MetricsData[] => {
  const data: MetricsData[] = []
  const now = new Date()

  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.floor(Math.random() * 40 + 35),
      memory: Math.floor(Math.random() * 30 + 50),
      disk: Math.floor(Math.random() * 20 + 50),
      network: Math.floor(Math.random() * 50 + 20),
    })
  }
  return data
}

interface ContainersPageProps {
  isDarkMode: boolean
}

export function ContainersPage({ isDarkMode }: ContainersPageProps) {
  const [containers, setContainers] = useState<Container[]>(initialContainers)
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(initialContainers[0])
  const [metricsData, setMetricsData] = useState<MetricsData[]>(generateMetricsData())
  const [showAllContainers, setShowAllContainers] = useState(false)
  const [activeTab, setActiveTab] = useState<"prometheus" | "grafana" | "metrics">("metrics")
  const [viewingDetails, setViewingDetails] = useState(false)

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setContainers((prev) =>
        prev.map((container) => ({
          ...container,
          cpu: container.status === "active" ? Math.floor(Math.random() * 40 + 30) : 0,
          memory: container.status === "active" ? Math.floor(Math.random() * 30 + 40) : 0,
          network: container.status === "active" ? Math.floor(Math.random() * 50 + 10) : 0,
        })),
      )

      setMetricsData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          cpu: Math.floor(Math.random() * 40 + 35),
          memory: Math.floor(Math.random() * 30 + 50),
          disk: Math.floor(Math.random() * 20 + 50),
          network: Math.floor(Math.random() * 50 + 20),
        })
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const toggleContainerStatus = (id: string) => {
    setContainers((prev) =>
      prev.map((container) =>
        container.id === id
          ? {
              ...container,
              status: container.status === "active" ? "inactive" : "active",
              cpu: container.status === "active" ? 0 : Math.floor(Math.random() * 40 + 30),
              memory: container.status === "active" ? 0 : Math.floor(Math.random() * 30 + 40),
              network: container.status === "active" ? 0 : Math.floor(Math.random() * 50 + 10),
            }
          : container,
      ),
    )
  }

  const displayedContainers = showAllContainers ? containers : containers.slice(0, 6)

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {viewingDetails && (
          <button
            onClick={() => setViewingDetails(false)}
            className="flex items-center gap-2 text-primary hover:text-secondary font-semibold mb-6 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Containers List
          </button>
        )}

        {!viewingDetails ? (
          <>
            {/* Header with PRISM Full Form */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-heading">Containers</h1>
              </div>
              <p className="text-body text-sm">
                PRISM – Predictive Root-cause Intelligence for System Monitoring
              </p>
              <p className="text-body mt-1">
                Monitor and manage container resources and performance in real-time
              </p>
            </div>

            {/* Scrollable Containers Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-heading">Active Containers ({containers.length})</h2>
                {containers.length > 6 && !showAllContainers && (
                  <button
                    onClick={() => setShowAllContainers(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className={`overflow-x-auto pb-4 ${showAllContainers ? "" : "max-h-96"}`}>
                <div
                  className={`${showAllContainers ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex gap-4 min-w-full"}`}
                >
                  {displayedContainers.map((container) => (
                    <div
                      key={container.id}
                      onClick={() => {
                        setSelectedContainer(container)
                        setViewingDetails(true)
                      }}
                      className={`bg-card rounded-xl border-2 transition-all cursor-pointer flex-shrink-0 ${showAllContainers ? "" : "w-80"} ${
                        selectedContainer?.id === container.id
                          ? "border-primary shadow-lg shadow-primary/20 hover:shadow-xl"
                          : "border-border hover:border-primary hover:shadow-md"
                      } hover:-translate-y-1`}
                    >
                      <div className="p-5">
                        {/* Container Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-heading text-lg">{container.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleContainerStatus(container.id)
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                              container.status === "active"
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            {container.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-3 text-sm mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-body">CPU</span>
                            <span className="font-semibold text-primary">{container.cpu}%</span>
                          </div>
                          <div className="w-full bg-disabled-bg rounded-full h-2 border border-border">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${container.cpu}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-body">Memory</span>
                            <span className="font-semibold text-secondary">{container.memory}%</span>
                          </div>
                          <div className="w-full bg-disabled-bg rounded-full h-2 border border-border">
                            <div
                              className="bg-secondary h-full rounded-full transition-all"
                              style={{ width: `${container.memory}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-body">Disk</span>
                            <span className="font-semibold text-accent">{container.disk}%</span>
                          </div>
                          <div className="w-full bg-disabled-bg rounded-full h-2 border border-border">
                            <div
                              className="bg-accent h-full rounded-full transition-all"
                              style={{ width: `${container.disk}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-body">Network</span>
                            <span className="font-semibold text-primary">{container.network} Mbps</span>
                          </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-4 text-xs text-body border-t border-border">
                          <span>Last Started</span>
                          <span className="text-heading font-medium">
                            {container.lastStarted}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View More Button for Extra Containers */}
              {showAllContainers && containers.length > 6 && (
                <button
                  onClick={() => setShowAllContainers(false)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white border-2 border-primary rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Collapse View
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Detailed Metrics View with Prometheus/Grafana Tabs */}
            {selectedContainer && (
              <div className="bg-card rounded-xl border-2 border-border overflow-hidden shadow-lg hover:border-primary transition-all duration-300">
                {/* Tab Navigation */}
                <div className="flex border-b-2 border-border bg-hover">
                  <button
                    onClick={() => setActiveTab("metrics")}
                    className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                      activeTab === "metrics" ? "text-primary border-primary" : "text-body border-transparent hover:text-primary hover:border-primary/50"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Live Metrics
                  </button>
                  <button
                    onClick={() => setActiveTab("prometheus")}
                    className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                      activeTab === "prometheus" ? "text-primary border-primary" : "text-body border-transparent hover:text-primary hover:border-primary/50"
                    }`}
                  >
                    Prometheus
                  </button>
                  <button
                    onClick={() => setActiveTab("grafana")}
                    className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                      activeTab === "grafana" ? "text-primary border-primary" : "text-body border-transparent hover:text-primary hover:border-primary/50"
                    }`}
                  >
                    Grafana
                  </button>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-heading mb-6">
                    {selectedContainer.name} - {activeTab.toUpperCase()}
                  </h2>

                  {activeTab === "metrics" && selectedContainer.status === "active" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* CPU Graph */}
                      <div className="bg-hover rounded-xl p-4 border-2 border-border hover:border-primary transition-all">
                        <h3 className="text-lg font-semibold text-heading mb-4">CPU Usage</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={metricsData}>
                            <defs>
                              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                            <XAxis dataKey="time" stroke="#1E293B" />
                            <YAxis stroke="#1E293B" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                borderRadius: "8px",
                                color: "#1E293B",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="cpu"
                              stroke="#A78BFA"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorCpu)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Memory Graph */}
                      <div className="bg-hover rounded-xl p-4 border-2 border-border hover:border-primary transition-all">
                        <h3 className="text-lg font-semibold text-heading mb-4">Memory Usage</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                            <XAxis dataKey="time" stroke="#1E293B" />
                            <YAxis stroke="#1E293B" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                borderRadius: "8px",
                                color: "#1E293B",
                              }}
                            />
                            <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Network Graph */}
                      <div className="bg-hover rounded-xl p-4 border-2 border-border hover:border-primary transition-all">
                        <h3 className="text-lg font-semibold text-heading mb-4">Network Traffic</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                            <XAxis dataKey="time" stroke="#1E293B" />
                            <YAxis stroke="#1E293B" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                borderRadius: "8px",
                                color: "#1E293B",
                              }}
                            />
                            <Bar dataKey="network" fill="#C4B5FD" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Disk Usage Graph */}
                      <div className="bg-hover rounded-xl p-4 border-2 border-border hover:border-primary transition-all">
                        <h3 className="text-lg font-semibold text-heading mb-4">Disk Usage</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                            <XAxis dataKey="time" stroke="#1E293B" />
                            <YAxis stroke="#1E293B" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                borderRadius: "8px",
                                color: "#1E293B",
                              }}
                            />
                            <Line type="monotone" dataKey="disk" stroke="#C4B5FD" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : activeTab === "prometheus" ? (
                    <div className="bg-hover rounded-xl p-8 border-2 border-dashed border-border text-center hover:border-primary transition-all">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold text-heading mb-2">Prometheus Integration</h3>
                      <p className="text-body">
                        Connect your Prometheus server to visualize detailed metrics and historical data for{" "}
                        {selectedContainer.name}
                      </p>
                      <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Connect Prometheus
                      </button>
                    </div>
                  ) : activeTab === "grafana" ? (
                    <div className="bg-hover rounded-xl p-8 border-2 border-dashed border-border text-center hover:border-primary transition-all">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold text-heading mb-2">Grafana Integration</h3>
                      <p className="text-body">
                        Connect your Grafana dashboards to view advanced visualizations and analytics for{" "}
                        {selectedContainer.name}
                      </p>
                      <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Connect Grafana
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-body">
                        Container is inactive. Turn on the container to view live metrics.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
