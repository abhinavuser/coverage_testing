"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const distributionData = [
  { name: "Functional Tests", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Integration Tests", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Unit Tests", value: 20, color: "hsl(var(--chart-3))" },
  { name: "E2E Tests", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Performance Tests", value: 5, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  value: {
    label: "Coverage %",
  },
}

export function CoverageDistributionPie() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Coverage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Coverage: {data.value}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
