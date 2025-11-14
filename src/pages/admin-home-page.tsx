"use client"

import { AlertTriangle, Users, Server, TrendingUp, FileText } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const anomalyTrendData = [
  { time: "00:00", count: 12 },
  { time: "04:00", count: 19 },
  { time: "08:00", count: 15 },
  { time: "12:00", count: 25 },
  { time: "16:00", count: 22 },
  { time: "20:00", count: 28 },
  { time: "24:00", count: 31 },
]

const systemHealthData = [
  { name: "Server 1", healthy: 95, warning: 5 },
  { name: "Server 2", healthy: 82, warning: 18 },
  { name: "Server 3", healthy: 60, warning: 40 },
  { name: "Database", healthy: 88, warning: 12 },
]

export function AdminHomePage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl mb-4 border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-2xl tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Global system overview and management</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-heading">Total SREs</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-heading">12</p>
            <p className="text-xs text-primary mt-2 font-medium">↑ 2 from last week</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-heading">Active Anomalies</h3>
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-heading">31</p>
            <p className="text-xs text-primary mt-2 font-medium">↑ 8 in last 24h</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-heading">Monitored Systems</h3>
              <Server className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-heading">4</p>
            <p className="text-xs text-primary mt-2 font-medium">All healthy</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-heading">Pending Reports</h3>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-heading">7</p>
            <p className="text-xs text-primary mt-2 font-medium">Awaiting approval</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Anomaly Trend */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Anomaly Trend (24h)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={anomalyTrendData}>
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
                <Line type="monotone" dataKey="count" stroke="#A78BFA" strokeWidth={3} dot={{ fill: "#A78BFA", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* System Health */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              System Health Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={systemHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="name" stroke="#1E293B" />
                <YAxis stroke="#1E293B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    color: "#1E293B",
                  }}
                />
                <Legend />
                <Bar dataKey="healthy" fill="#A78BFA" />
                <Bar dataKey="warning" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
          <h2 className="text-lg font-semibold text-heading mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-hover rounded-lg hover:bg-primary/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="text-heading font-medium">Critical: CPU spike on Server 3</p>
                <p className="text-xs text-body">2 minutes ago by Jayasree</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-hover rounded-lg hover:bg-primary/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <div className="flex-1">
                <p className="text-heading font-medium">Warning: Memory trending up on Server 2</p>
                <p className="text-xs text-body">15 minutes ago by Priya</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-hover rounded-lg hover:bg-primary/10 transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="text-heading font-medium">RCA Report submitted and approved</p>
                <p className="text-xs text-body">1 hour ago by Arjun</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
