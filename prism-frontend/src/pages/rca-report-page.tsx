"use client"

import { Download, FileText } from "lucide-react"

const rcaReportContent = `ROOT CAUSE ANALYSIS REPORT

Report ID: RCA-2024-11-08-001
Generated: November 8, 2024 - 14:32:45 UTC
Severity Level: HIGH
Status: RESOLVED

═══════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
─────────────────────────────────────────────────────────

On November 8, 2024, the system experienced a critical CPU spike that lasted 15 minutes. The incident resulted in service degradation affecting approximately 2.3% of user requests. The root cause was identified as an unoptimized database query running in production.

═══════════════════════════════════════════════════════════

INCIDENT TIMELINE
─────────────────────────────────────────────────────────

14:15:00 UTC - Anomaly detected: CPU usage spiked to 94%
14:15:30 UTC - Alert triggered to on-call team
14:16:00 UTC - Initial investigation started
14:18:45 UTC - Root cause identified: Query optimization issue
14:22:15 UTC - Mitigation applied: Connection pool adjustment
14:30:00 UTC - Services returned to normal operation
14:32:45 UTC - Post-incident analysis completed

═══════════════════════════════════════════════════════════

ROOT CAUSE ANALYSIS
─────────────────────────────────────────────────────────

PRIMARY CAUSE:
A complex JOIN query on the users_transactions table was not
utilizing available indexes, causing a full table scan on 
2.1 million records. This was triggered by a batch job scheduled
at 14:15 UTC.

CONTRIBUTING FACTORS:
1. Recent schema changes didn't update query optimization hints
2. Index fragmentation on production database (78% fragmentation)
3. Connection pool exhaustion leading to request queuing
4. Lack of query timeout configuration

═══════════════════════════════════════════════════════════

IMPACT ASSESSMENT
─────────────────────────────────────────────────────────

Duration: 15 minutes
Affected Users: ~2,300 (0.15% of total user base)
Failed Requests: 1,247
API Latency Increase: 340% above baseline
Average Response Time: 8,234ms (normal: 215ms)
Revenue Impact: Estimated $12,400

═══════════════════════════════════════════════════════════

REMEDIATION ACTIONS
─────────────────────────────────────────────────────────

IMMEDIATE (Completed):
✓ Added FORCE INDEX hint to problematic query
✓ Adjusted connection pool settings
✓ Implemented circuit breaker for batch jobs

SHORT-TERM (In Progress):
• Rebuild database indexes (ETA: 2024-11-09)
• Add query performance monitoring
• Implement automated query optimization

LONG-TERM (Planned):
• Migrate to query optimization framework
• Implement comprehensive database monitoring
• Establish query performance SLO
• Setup automated index maintenance

═══════════════════════════════════════════════════════════

PREVENTION MEASURES
─────────────────────────────────────────────────────────

1. Automated query performance testing in CI/CD pipeline
2. Database index health monitoring dashboard
3. Query timeout enforcement (30s limit)
4. Batch job execution rate limiting
5. Enhanced alerting on query execution plans

═══════════════════════════════════════════════════════════

LESSONS LEARNED
─────────────────────────────────────────────────────────

• Database schema changes require query re-optimization
• Batch jobs need scheduling coordination with peak hours
• Proactive monitoring of index fragmentation is critical
• Connection pool configuration must be revisited during scaling

═══════════════════════════════════════════════════════════

SIGN-OFF

Report Author: SRE Team
Reviewed By: Engineering Manager
Approved By: VP Engineering
Date: November 8, 2024`

export function RCAReportPage() {
  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([rcaReportContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "RCA-Report-2024-11-08.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center gap-4 drop-shadow-2xl tracking-tight">
              <FileText className="w-12 h-12" />
              RCA Report
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Root Cause Analysis Documentation</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-lg hover:border-primary transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-heading">RCA-2024-11-08-001</h2>
              <p className="text-sm text-body">Last Updated: November 8, 2024</p>
            </div>
          </div>

          <div className="space-y-6">
            {rcaReportContent.split("\n").map((line, idx) => {
              if (line.includes("═══")) {
                return <div key={idx} className="border-t border-border pt-4 mt-4"></div>
              }
              if (line.includes("───")) {
                return null
              }
              if (line.match(/^[A-Z]{2,}/)) {
                return (
                  <h3 key={idx} className="text-sm font-bold text-primary tracking-wider">
                    {line}
                  </h3>
                )
              }
              if (line.match(/^[•✓]/)) {
                return (
                  <div key={idx} className="text-body ml-4">
                    {line}
                  </div>
                )
              }
              return (
                <p key={idx} className={`text-body ${line.trim() === "" ? "mb-4" : ""}`}>
                  {line}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
