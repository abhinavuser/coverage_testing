"use client"

import { MetricCard } from "./metric-card"

const metricsData = [
  {
    title: "Security Score",
    value: "92%",
    change: 5.2,
    status: "good" as const,
    subtitle: "Excellent protection level",
  },
  {
    title: "Threat Detection",
    value: "98%",
    change: 2.1,
    status: "good" as const,
    subtitle: "142 of 145 threats blocked",
  },
  {
    title: "Vulnerability Coverage",
    value: "85%",
    change: -1.8,
    status: "warning" as const,
    subtitle: "3 critical vulnerabilities found",
  },
  {
    title: "Network Security",
    value: "94%",
    change: 8.3,
    status: "good" as const,
    subtitle: "All endpoints secured",
  },
  {
    title: "Data Protection",
    value: "89%",
    change: 3.2,
    status: "good" as const,
    subtitle: "Encryption protocols active",
  },
  {
    title: "Compliance Status",
    value: "96%",
    change: 1.5,
    status: "good" as const,
    subtitle: "SOC2 & ISO27001 compliant",
  },
]

export function MetricsOverview() {
  const handleMetricClick = (title: string) => {
    console.log(`Drilling down into ${title}`)
    // TODO: Implement drill-down functionality
  }

  return (
    <div className="space-y-6 animate-on-scroll">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground">Security Metrics</h3>
          <p className="text-sm text-muted-foreground">Real-time cybersecurity analytics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-on-scroll"></div>
          <span>Live monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.title} className="animate-on-scroll">
            <MetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              status={metric.status}
              subtitle={metric.subtitle}
              onClick={() => handleMetricClick(metric.title)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
