import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const metricsData = [
  { time: "00:00", cpu: 45, memory: 52, disk: 38, network: 25 },
  { time: "04:00", cpu: 52, memory: 58, disk: 42, network: 32 },
  { time: "08:00", cpu: 48, memory: 61, disk: 45, network: 28 },
  { time: "12:00", cpu: 61, memory: 55, disk: 48, network: 45 },
  { time: "16:00", cpu: 55, memory: 63, disk: 50, network: 38 },
  { time: "20:00", cpu: 67, memory: 72, disk: 55, network: 52 },
  { time: "24:00", cpu: 58, memory: 65, disk: 52, network: 42 },
]

export function MetricsPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-2xl tracking-tight">System Metrics</h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">Real-time performance metrics across your infrastructure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU Usage */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-heading mb-4">CPU Usage (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
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
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#1E293B" }} />
                <Area type="monotone" dataKey="cpu" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Memory Usage */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-heading mb-4">Memory Usage (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricsData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="time" stroke="#1E293B" />
                <YAxis stroke="#1E293B" />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#1E293B" }} />
                <Area type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Disk Usage */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-heading mb-4">Disk Usage (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricsData}>
                <defs>
                  <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="time" stroke="#1E293B" />
                <YAxis stroke="#1E293B" />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#1E293B" }} />
                <Area type="monotone" dataKey="disk" stroke="#C4B5FD" strokeWidth={2} fillOpacity={1} fill="url(#colorDisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Network Traffic */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-heading mb-4">Network Traffic (MB/s)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricsData}>
                <defs>
                  <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="time" stroke="#1E293B" />
                <YAxis stroke="#1E293B" />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#1E293B" }} />
                <Area type="monotone" dataKey="network" stroke="#C4B5FD" strokeWidth={2} fillOpacity={1} fill="url(#colorNetwork)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
