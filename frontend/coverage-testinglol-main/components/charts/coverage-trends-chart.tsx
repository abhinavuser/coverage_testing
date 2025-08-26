"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const trendData = [
  { date: "Jan", overall: 65, functional: 70, risk: 45, userJourney: 80, data: 60, environmental: 75 },
  { date: "Feb", overall: 68, functional: 72, risk: 48, userJourney: 82, data: 62, environmental: 78 },
  { date: "Mar", overall: 71, functional: 75, risk: 52, userJourney: 85, data: 65, environmental: 80 },
  { date: "Apr", overall: 74, functional: 78, risk: 55, userJourney: 87, data: 68, environmental: 83 },
  { date: "May", overall: 76, functional: 80, risk: 58, userJourney: 89, data: 70, environmental: 85 },
  { date: "Jun", overall: 78, functional: 85, risk: 62, userJourney: 91, data: 73, environmental: 89 },
]

const chartConfig = {
  overall: {
    label: "Overall",
    color: "hsl(var(--chart-1))",
  },
  functional: {
    label: "Functional",
    color: "hsl(var(--chart-2))",
  },
  risk: {
    label: "Risk",
    color: "hsl(var(--chart-3))",
  },
  userJourney: {
    label: "User Journey",
    color: "hsl(var(--chart-4))",
  },
  data: {
    label: "Data",
    color: "hsl(var(--chart-5))",
  },
  environmental: {
    label: "Environmental",
    color: "hsl(var(--accent))",
  },
}

export function CoverageTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Coverage Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="var(--color-chart-1)"
                strokeWidth={3}
                dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="functional"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-3)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="userJourney"
                stroke="var(--color-chart-4)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-4)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="data"
                stroke="var(--color-chart-5)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-5)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="environmental"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: "var(--color-accent)", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
