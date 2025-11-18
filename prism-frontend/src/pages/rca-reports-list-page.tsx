"use client"

import { useState } from "react"
import { FileText, Download, Eye, CheckCircle } from "lucide-react"

interface RCAReport {
  id: string
  title: string
  date: string
  sre: string
  system: string
  status: "pending" | "approved" | "resolved"
  severity: "high" | "medium" | "low"
  summary: string
}

const initialReports: RCAReport[] = [
  {
    id: "RCA-2024-11-08-001",
    title: "CPU Spike on Server 3",
    date: "Nov 8, 2024",
    sre: "Jayasree",
    system: "Server 3",
    status: "approved",
    severity: "high",
    summary: "Unoptimized database query triggered full table scan causing CPU spike",
  },
  {
    id: "RCA-2024-11-07-001",
    title: "Memory Leak in Cache Service",
    date: "Nov 7, 2024",
    sre: "Priya",
    system: "Cache Service",
    status: "approved",
    severity: "medium",
    summary: "Memory not released properly in cache eviction logic",
  },
  {
    id: "RCA-2024-11-06-001",
    title: "Network Latency Spike",
    date: "Nov 6, 2024",
    sre: "Vikram",
    system: "Database Cluster",
    status: "pending",
    severity: "medium",
    summary: "Connection pool exhaustion due to slow queries during peak hours",
  },
  {
    id: "RCA-2024-11-05-001",
    title: "Disk Space Critical Alert",
    date: "Nov 5, 2024",
    sre: "Arjun",
    system: "Server 1",
    status: "resolved",
    severity: "low",
    summary: "Log files accumulated without rotation - implemented daily cleanup",
  },
]

export function RCAReportsListPage() {
  const [reports, setReports] = useState<RCAReport[]>(initialReports)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "resolved">("all")
  const [selectedReport, setSelectedReport] = useState<RCAReport | null>(null)

  const filteredReports = filterStatus === "all" ? reports : reports.filter((r) => r.status === filterStatus)

  const handleApprove = (id: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
    setSelectedReport(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" }
      case "pending":
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" }
      case "resolved":
        return { bg: "bg-hover", border: "border-primary/50", text: "text-primary" }
      default:
        return { bg: "bg-disabled-bg", border: "border-border", text: "text-disabled-text" }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border border-red-200 text-red-600"
      case "medium":
        return "bg-amber-50 border border-amber-200 text-amber-600"
      case "low":
        return "bg-hover border border-primary/50 text-primary"
      default:
        return "bg-hover border border-border text-body"
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center gap-4 drop-shadow-2xl tracking-tight">
              <FileText className="w-12 h-12" />
              RCA Reports
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Review and manage all RCA reports submitted by SREs</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Total Reports</p>
            <p className="text-3xl font-bold text-heading">{reports.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Pending Approval</p>
            <p className="text-3xl font-bold text-secondary">{reports.filter((r) => r.status === "pending").length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Approved</p>
            <p className="text-3xl font-bold text-primary">{reports.filter((r) => r.status === "approved").length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Resolved</p>
            <p className="text-3xl font-bold text-primary">{reports.filter((r) => r.status === "resolved").length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 mb-4 shadow-lg">
              <h2 className="font-semibold text-heading mb-4">Filter</h2>
              <div className="space-y-2">
                {(["all", "pending", "approved", "resolved"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      filterStatus === status 
                        ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white shadow-md" 
                        : "text-body hover:bg-hover hover:text-primary"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-hover border-b border-border">
                <h2 className="font-semibold text-heading">Reports</h2>
              </div>
              <div className="overflow-y-auto max-h-96">
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left px-4 py-3 border-b border-border transition-all hover:bg-hover ${
                      selectedReport?.id === report.id ? "bg-hover border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-heading text-sm">{report.title}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${getSeverityColor(report.severity)}`}
                      >
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-xs text-body">
                      {report.date} by {report.sre}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Details */}
          {selectedReport && (
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6 shadow-lg hover:border-primary transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-heading">{selectedReport.title}</h2>
                    <p className="text-body text-sm mt-2">{selectedReport.id}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedReport.status).border} ${getStatusColor(selectedReport.status).bg} ${getStatusColor(selectedReport.status).text}`}
                  >
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-1 font-medium">SRE</p>
                    <p className="text-heading font-semibold">{selectedReport.sre}</p>
                  </div>
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-1 font-medium">System</p>
                    <p className="text-heading font-semibold">{selectedReport.system}</p>
                  </div>
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-1 font-medium">Date</p>
                    <p className="text-heading font-semibold">{selectedReport.date}</p>
                  </div>
                  <div className="bg-hover rounded-xl p-4 border border-border">
                    <p className="text-body text-sm mb-1 font-medium">Severity</p>
                    <p
                      className={`font-semibold ${selectedReport.severity === "high" ? "text-red-600" : selectedReport.severity === "medium" ? "text-amber-600" : "text-primary"}`}
                    >
                      {selectedReport.severity.charAt(0).toUpperCase() + selectedReport.severity.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-heading mb-3">Summary</h3>
                  <p className="text-body leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    <Eye className="w-4 h-4" />
                    View Full Report
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-disabled-bg hover:bg-hover text-body border border-border rounded-lg transition-all font-semibold">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {selectedReport.status === "pending" && (
                    <button
                      onClick={() => handleApprove(selectedReport.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
