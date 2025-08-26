"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  status: "critical" | "warning" | "good"
  subtitle?: string
  onClick?: () => void
}

export function MetricCard({ title, value, change, status, subtitle, onClick }: MetricCardProps) {
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
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendText = () => {
    if (change === 0) return "No change"
    const direction = change > 0 ? "increase" : "decrease"
    return `${Math.abs(change)}% ${direction}`
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        onClick && "hover:bg-accent/50",
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold", getStatusColor(status))}>{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon()}
            <span
              className={cn(change > 0 ? "text-green-500" : change < 0 ? "text-destructive" : "text-muted-foreground")}
            >
              {getTrendText()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
