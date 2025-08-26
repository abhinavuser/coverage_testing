"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, TestTube, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  feature: {
    id: string
    name: string
    coverage: number
    riskLevel: number
    testCount: number
    lastUpdated: string
    status: "critical" | "warning" | "good"
    trend: "up" | "down" | "stable"
    description?: string
  }
  onClick: (featureId: string) => void
}

export function FeatureCard({ feature, onClick }: FeatureCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-destructive"
      case "warning":
        return "text-yellow-500"
      case "good":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "good":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTrendIcon = () => {
    switch (feature.trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />
      default:
        return null
    }
  }

  const getRiskStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn("text-xs", i < level ? "text-yellow-500" : "text-muted-foreground")}>
        ★
      </span>
    ))
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:bg-accent/50"
      onClick={() => onClick(feature.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{feature.name}</h3>
            {feature.description && <p className="text-xs text-muted-foreground">{feature.description}</p>}
          </div>
          <Badge variant={getStatusBadgeVariant(feature.status)} className="text-xs">
            {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coverage Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Coverage</span>
            <div className="flex items-center gap-1">
              <span className={cn("text-sm font-medium", getStatusColor(feature.status))}>{feature.coverage}%</span>
              {getTrendIcon()}
            </div>
          </div>
          <Progress value={feature.coverage} className="h-2" />
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Risk Level</span>
          <div className="flex items-center gap-1">{getRiskStars(feature.riskLevel)}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{feature.testCount} tests</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{feature.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
