"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, TestTube, TrendingUp, TrendingDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureListItemProps {
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

export function FeatureListItem({ feature, onClick }: FeatureListItemProps) {
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
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getRiskStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn("text-sm", i < level ? "text-yellow-500" : "text-muted-foreground")}>
        ★
      </span>
    ))
  }

  return (
    <div
      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onClick(feature.id)}
    >
      {/* Feature Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-foreground truncate">{feature.name}</h3>
          <Badge variant={getStatusBadgeVariant(feature.status)} className="text-xs">
            {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
          </Badge>
        </div>
        {feature.description && <p className="text-sm text-muted-foreground truncate">{feature.description}</p>}
      </div>

      {/* Coverage */}
      <div className="w-32">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Coverage</span>
          <div className="flex items-center gap-1">
            <span className={cn("text-sm font-medium", getStatusColor(feature.status))}>{feature.coverage}%</span>
            {getTrendIcon()}
          </div>
        </div>
        <Progress value={feature.coverage} className="h-1.5" />
      </div>

      {/* Risk Level */}
      <div className="w-24 text-center">
        <div className="text-xs text-muted-foreground mb-1">Risk</div>
        <div className="flex items-center justify-center gap-0.5">{getRiskStars(feature.riskLevel)}</div>
      </div>

      {/* Test Count */}
      <div className="w-20 text-center">
        <div className="text-xs text-muted-foreground mb-1">Tests</div>
        <div className="flex items-center justify-center gap-1">
          <TestTube className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{feature.testCount}</span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="w-24 text-center">
        <div className="text-xs text-muted-foreground mb-1">Updated</div>
        <div className="flex items-center justify-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{feature.lastUpdated}</span>
        </div>
      </div>

      {/* Expand Arrow */}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}
