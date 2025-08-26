"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

const scatterData = [
  { name: "Authentication", coverage: 85, risk: 9, category: "critical" },
  { name: "Payment", coverage: 92, risk: 8, category: "critical" },
  { name: "User Profile", coverage: 78, risk: 4, category: "medium" },
  { name: "Search", coverage: 65, risk: 3, category: "low" },
  { name: "Notifications", coverage: 45, risk: 7, category: "critical" },
  { name: "Settings", coverage: 88, risk: 2, category: "low" },
  { name: "Dashboard", coverage: 72, risk: 5, category: "medium" },
  { name: "Reports", coverage: 55, risk: 6, category: "medium" },
  { name: "API Integration", coverage: 38, risk: 9, category: "critical" },
  { name: "File Upload", coverage: 82, risk: 4, category: "medium" },
]

const chartConfig = {
  coverage: {
    label: "Coverage %",
    color: "hsl(var(--chart-1))",
  },
  risk: {
    label: "Risk Level",
    color: "hsl(var(--chart-2))",
  },
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "critical":
      return "hsl(var(--destructive))"
    case "medium":
      return "hsl(var(--chart-2))"
    case "low":
      return "hsl(var(--chart-4))"
    default:
      return "hsl(var(--muted-foreground))"
  }
}

export function RiskCoverageScatter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Risk vs Coverage Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={scatterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" dataKey="coverage" name="Coverage" unit="%" domain={[0, 100]} className="text-xs" />
              <YAxis type="number" dataKey="risk" name="Risk" domain={[0, 10]} className="text-xs" />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Coverage: {data.coverage}%</p>
                        <p className="text-sm text-muted-foreground">Risk Level: {data.risk}/10</p>
                        <p className="text-sm text-muted-foreground">Priority: {data.category}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter name="Features" dataKey="risk" fill="var(--color-chart-1)">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
