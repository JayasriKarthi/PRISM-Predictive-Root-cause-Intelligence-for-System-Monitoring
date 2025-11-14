"use client"

import { useState } from "react"
import { Send, AlertTriangle, Clock } from "lucide-react"

const anomalies = [
  {
    id: 1,
    type: "CPU Spike",
    severity: "high",
    time: "2 hours ago",
    description: "CPU usage exceeded 85% for 15 minutes",
  },
  {
    id: 2,
    type: "Memory Leak",
    severity: "medium",
    time: "4 hours ago",
    description: "Memory usage trending up without release",
  },
  {
    id: 3,
    type: "Network Latency",
    severity: "medium",
    time: "6 hours ago",
    description: "Response time increased by 40%",
  },
  {
    id: 4,
    type: "Disk Pressure",
    severity: "low",
    time: "12 hours ago",
    description: "Available disk space below 200GB threshold",
  },
  {
    id: 5,
    type: "Service Timeout",
    severity: "high",
    time: "1 day ago",
    description: "API service response timeout detected",
  },
]

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AnomalyPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0])
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I can help you analyze system anomalies and provide insights. Select an anomaly to the left to get started.",
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = { role: "user", content: inputValue }
    setMessages([...messages, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on the ${selectedAnomaly.type}, this appears to be related to unusual system load. I recommend checking running processes and services.`,
        `The ${selectedAnomaly.type} pattern suggests a potential issue with resource allocation. Consider scaling resources or optimizing queries.`,
        `This anomaly might indicate a performance degradation. I suggest running a detailed diagnostic on affected services.`,
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
    }, 500)

    setInputValue("")
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
              <AlertTriangle className="w-12 h-12" />
              Anomaly Detection
            </h1>
            <p className="text-white text-xl font-semibold drop-shadow-lg">AI-powered anomaly analysis and insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Anomaly List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-lg">
            <div className="p-4 border-b border-border bg-hover">
              <h2 className="font-semibold text-heading flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Detected Anomalies
              </h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {anomalies.map((anomaly) => (
                <button
                  key={anomaly.id}
                  onClick={() => setSelectedAnomaly(anomaly)}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-all hover:bg-hover ${
                    selectedAnomaly.id === anomaly.id ? "bg-hover border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-heading text-sm">{anomaly.type}</p>
                      <p className="text-xs text-body mt-1">{anomaly.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${getSeverityColor(anomaly.severity)}`}
                    >
                      {anomaly.severity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col shadow-lg">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-heading">{selectedAnomaly.type}</h2>
                  <p className="text-xs text-body flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {selectedAnomaly.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                      message.role === "user" 
                        ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white" 
                        : "bg-hover text-heading border border-border"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about this anomaly..."
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-hover border border-primary/50 hover:bg-primary/10 text-primary rounded-lg transition-all font-semibold hover:border-primary hover:shadow-md">
                Send to RCA Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
