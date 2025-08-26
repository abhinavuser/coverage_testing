"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Target, Clock } from "lucide-react"

const insights = [
  {
    icon: AlertTriangle,
    title: "Critical Gap Detected",
    description: "Authentication module has 45% coverage gap",
    priority: "high",
    time: "2 min ago",
  },
  {
    icon: TrendingUp,
    title: "Coverage Improvement",
    description: "Payment flow coverage increased by 12%",
    priority: "medium",
    time: "15 min ago",
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description: "User registration tests reached 95% target",
    priority: "low",
    time: "1 hour ago",
  },
]

export function QuickInsights() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="mt-0.5">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {insight.time}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
