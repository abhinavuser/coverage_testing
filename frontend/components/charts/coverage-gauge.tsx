"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Covered", value: 78, color: "#dc2626" },
  { name: "Uncovered", value: 22, color: "#e5e7eb" },
]

export function CoverageGauge() {
  return (
    <Card className="animate-on-scroll">
      <CardHeader>
        <CardTitle className="text-lg font-serif">Overall Coverage</CardTitle>
        <CardDescription>Functional test coverage percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">78%</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
