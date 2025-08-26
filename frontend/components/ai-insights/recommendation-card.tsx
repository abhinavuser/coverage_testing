"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Brain, ChevronDown, ChevronUp, CheckCircle, X, TrendingUp, Clock, Target, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecommendationCardProps {
  recommendation: {
    id: string
    title: string
    description: string
    type: "Critical Gap" | "ML Insight" | "Data Gap" | "Performance" | "Security" | "Best Practice" | "Threat Detection" | "Security Gap" | "Threat Prevention"
    priority: "critical" | "high" | "medium" | "low"
    impactScore: number
    effort: "Low" | "Medium" | "High"
    roi: number
    estimatedTime: string
    affectedFeatures: string[]
    actionDetails: string[]
    generatedAt: string
    status: "new" | "addressed" | "dismissed"
  }
  onStatusChange: (id: string, status: "addressed" | "dismissed") => void
}

export function RecommendationCard({ recommendation, onStatusChange }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-blue-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ML Insight":
        return <Brain className="h-4 w-4" />
      case "Performance":
        return <TrendingUp className="h-4 w-4" />
      case "Security":
      case "Security Gap":
        return <Target className="h-4 w-4" />
      case "Threat Detection":
      case "Threat Prevention":
        return <Shield className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low":
        return "text-green-500"
      case "Medium":
        return "text-yellow-500"
      case "High":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  if (recommendation.status !== "new") {
    return null // Don't render addressed or dismissed recommendations
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1">{getTypeIcon(recommendation.type)}</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", getPriorityColor(recommendation.priority))}>
                  {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {recommendation.type}
                </Badge>
                {recommendation.type === "ML Insight" && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    AI Generated
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-foreground">{recommendation.title}</h3>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(recommendation.id, "addressed")}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Address
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(recommendation.id, "dismissed")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{recommendation.impactScore}/10</div>
            <div className="text-xs text-muted-foreground">Impact Score</div>
          </div>
          <div className="text-center">
            <div className={cn("text-lg font-bold", getEffortColor(recommendation.effort))}>
              {recommendation.effort}
            </div>
            <div className="text-xs text-muted-foreground">Effort</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-500">{recommendation.roi}%</div>
            <div className="text-xs text-muted-foreground">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{recommendation.estimatedTime}</div>
            <div className="text-xs text-muted-foreground">Est. Time</div>
          </div>
        </div>

        {/* Impact Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Impact Level</span>
            <span className="text-sm font-medium">{recommendation.impactScore}/10</span>
          </div>
          <Progress value={recommendation.impactScore * 10} className="h-2" />
        </div>

        {/* Affected Features */}
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Affected Features:</span>
          <div className="flex flex-wrap gap-1">
            {recommendation.affectedFeatures.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expandable Action Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium">Action Details</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <ul className="space-y-1">
                {recommendation.actionDetails.map((action, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Generated Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Clock className="h-3 w-3" />
          <span>Generated {recommendation.generatedAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
