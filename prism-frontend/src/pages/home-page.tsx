import { Brain, TrendingDown, Zap, Lock, Cpu, BarChart3, Clock, Users } from "lucide-react"

export function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-3xl p-12 shadow-2xl mb-8 border-4 border-white/20 hover:shadow-[0_0_40px_rgba(167,139,250,0.6)] transition-all duration-300">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 text-balance drop-shadow-2xl tracking-tight">PRISM</h1>
            <p className="text-2xl text-white font-bold mb-4 drop-shadow-lg">
              Predictive Root-cause Intelligence for System Monitoring
            </p>
            <p className="text-xl text-white font-semibold max-w-3xl mx-auto drop-shadow-md">
              A next-generation GenAI-powered observability assistant designed to revolutionize how organizations detect,
              diagnose, and resolve system issues.
            </p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-card rounded-2xl border border-border p-8 mb-16 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-3xl font-bold text-heading mb-6">Our Mission</h2>
          <p className="text-foreground leading-relaxed text-lg">
            We bring intelligence, transparency, and automation into IT operations. By leveraging advanced machine
            learning, large language models, and causal reasoning, PRISM continuously monitors system health, analyzes
            anomalies, and uncovers hidden dependencies leading to failures.
          </p>
          <p className="text-primary italic mt-6 text-lg font-semibold">
            "Turning Observability into Actionable Intelligence"
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent mb-2">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Data Ingestion</h3>
              <p className="text-body text-sm">Collects metrics, logs, and traces from distributed systems</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Anomaly Detection</h3>
              <p className="text-body text-sm">
                Uses deep learning models to detect unusual behavior in real time
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Root Cause Analysis</h3>
              <p className="text-body text-sm">Applies causal inference to trace issues to their origin</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hover rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Explainable Insights</h3>
              <p className="text-body text-sm">
                Generates interpretable diagnostic reports using GenAI summarization
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-12 h-12 bg-hover rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">Autonomous Remediation</h3>
              <p className="text-body text-sm">Suggests or automates corrective actions to restore stability</p>
            </div>
          </div>
          <p className="text-center text-body mt-8 text-lg">
            <span className="font-semibold text-heading">PRISM</span> doesn't just find what went wrong — it explains why
            and how to fix it.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">Intelligent Anomaly Detection</h3>
              <p className="text-body">
                Detects performance drops and unusual patterns using AI-driven time-series models.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">Root Cause Reasoning</h3>
              <p className="text-body">
                Performs chain-of-cause analysis to trace anomalies back to their source components.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">Observability Intelligence</h3>
              <p className="text-body">
                Aggregates metrics, logs, and traces into a unified, explainable insight dashboard.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">Autonomous Diagnosis</h3>
              <p className="text-body">
                Uses GenAI agents to automate incident classification, summarization, and root-cause reports.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">Transparent & Responsible AI</h3>
              <p className="text-body">
                Ensures every decision is explainable, auditable, and aligned with responsible AI principles.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-heading mb-8 text-center">Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Reduced Downtime</h3>
                  <p className="text-body">
                    Faster incident resolution through predictive insights and automated detection.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Smarter Operations</h3>
                  <p className="text-body">Empowers IT teams with contextual, AI-driven system intelligence.</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Enhanced Efficiency</h3>
                  <p className="text-body">
                    Automated RCA and reporting reduce manual workloads and response time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-hover rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Trustworthy Systems</h3>
                  <p className="text-body">
                    Brings transparency and accountability to AI-driven observability pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-body mb-2">© 2025 PRISM – Predictive Root-cause Intelligence for System Monitoring</p>
          <p className="text-body/70">All Rights Reserved. Empowering AI-driven Observability with Integrity.</p>
        </div>
      </div>
    </div>
  )
}
