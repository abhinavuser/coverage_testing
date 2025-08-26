"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const featureData = [
  { feature: "Auth", coverage: 85, tests: 42, target: 90 },
  { feature: "Payment", coverage: 92, tests: 38, target: 95 },
  { feature: "Profile", coverage: 78, tests: 25, target: 85 },
  { feature: "Search", coverage: 65, tests: 18, target: 80 },
  { feature: "Notifications", coverage: 45, tests: 12, target: 75 },
  { feature: "Settings", coverage: 88, tests: 22, target: 90 },
  { feature: "Dashboard", coverage: 72, tests: 28, target: 85 },
  { feature: "Reports", coverage: 55, tests: 15, target: 80 },
]

const chartConfig = {
  coverage: {
    label: "Current Coverage",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Coverage",
    color: "hsl(var(--muted-foreground))",
  },
}

export function FeatureBreakdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Feature-wise Coverage Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="feature" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">Coverage: {data.coverage}%</p>
                        <p className="text-sm text-muted-foreground">Target: {data.target}%</p>
                        <p className="text-sm text-muted-foreground">Tests: {data.tests}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="target" fill="var(--color-muted)" opacity={0.3} />
              <Bar dataKey="coverage" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
