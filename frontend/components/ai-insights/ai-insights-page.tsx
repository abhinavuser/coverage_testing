"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecommendationCard } from "./recommendation-card"
import { RefreshCw, Filter, Shield } from "lucide-react"

type Recommendation = {
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

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Critical Zero-Day Vulnerability Detected",
    description:
      "AI analysis identified potential zero-day exploit patterns in network traffic that require immediate attention.",
    type: "ML Insight" as const,
    priority: "critical" as const,
    impactScore: 9,
    effort: "High" as const,
    roi: 95,
    estimatedTime: "Immediate",
    affectedFeatures: ["Network Security", "Firewall", "Intrusion Detection"],
    actionDetails: [
      "Deploy emergency security patches",
      "Implement additional network monitoring",
      "Review and update firewall rules",
      "Conduct immediate vulnerability assessment",
    ],
    generatedAt: "2 hours ago",
    status: "new" as const,
  },
  {
    id: "2",
    title: "Suspicious Authentication Patterns",
    description: "Machine learning detected unusual login patterns suggesting potential brute force attacks.",
    type: "Threat Detection" as const,
    priority: "high" as const,
    impactScore: 8,
    effort: "Medium" as const,
    roi: 85,
    estimatedTime: "1-2 days",
    affectedFeatures: ["Access Control", "Authentication", "User Management"],
    actionDetails: [
      "Implement advanced rate limiting",
      "Deploy multi-factor authentication",
      "Review user access logs",
      "Update password policies",
    ],
    generatedAt: "4 hours ago",
    status: "new" as const,
  },
  {
    id: "3",
    title: "Data Encryption Vulnerability",
    description: "Security audit revealed weak encryption protocols that could compromise sensitive data.",
    type: "Security Gap" as const,
    priority: "high" as const,
    impactScore: 9,
    effort: "Medium" as const,
    roi: 92,
    estimatedTime: "3-5 days",
    affectedFeatures: ["Data Encryption", "Database Security", "API Security"],
    actionDetails: [
      "Upgrade to AES-256 encryption",
      "Implement key rotation policies",
      "Review data transmission protocols",
      "Update encryption certificates",
    ],
    generatedAt: "6 hours ago",
    status: "new" as const,
  },
  {
    id: "4",
    title: "Network Intrusion Attempt Blocked",
    description: "AI-powered intrusion detection system identified and blocked sophisticated attack attempts.",
    type: "Threat Prevention" as const,
    priority: "medium" as const,
    impactScore: 7,
    effort: "Low" as const,
    roi: 75,
    estimatedTime: "1-2 days",
    affectedFeatures: ["Intrusion Detection", "Network Monitoring", "Incident Response"],
    actionDetails: [
      "Review attack vectors and patterns",
      "Update intrusion detection rules",
      "Strengthen network perimeter security",
      "Document incident for future reference",
    ],
    generatedAt: "1 day ago",
    status: "new" as const,
  },
  {
    id: "5",
    title: "Security Policy Optimization",
    description: "AI analysis suggests optimizations to security policies based on current threat landscape.",
    type: "Best Practice" as const,
    priority: "low" as const,
    impactScore: 5,
    effort: "Low" as const,
    roi: 65,
    estimatedTime: "2-3 days",
    affectedFeatures: ["Security Policies", "Compliance", "Risk Management"],
    actionDetails: [
      "Update security policy documentation",
      "Review compliance requirements",
      "Implement automated policy enforcement",
      "Train staff on new security protocols",
    ],
    generatedAt: "2 days ago",
    status: "new" as const,
  },
]

export function AIInsightsPage() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("impact")

  const handleStatusChange = (id: string, status: "addressed" | "dismissed") => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status } : rec)))
  }

  const filteredRecommendations = recommendations
    .filter((rec) => {
      const matchesType = typeFilter === "all" || rec.type === typeFilter
      const matchesPriority = priorityFilter === "all" || rec.priority === priorityFilter
      return matchesType && matchesPriority && rec.status === "new"
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "impact":
          return b.impactScore - a.impactScore
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "date":
          return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        default:
          return 0
      }
    })

  const getInsightStats = () => {
    const activeRecs = recommendations.filter((rec) => rec.status === "new")
    const criticalCount = activeRecs.filter((rec) => rec.priority === "critical").length
    const highCount = activeRecs.filter((rec) => rec.priority === "high").length
    const mlInsights = activeRecs.filter((rec) => rec.type === "ML Insight").length
    const avgImpact = activeRecs.reduce((sum, rec) => sum + rec.impactScore, 0) / activeRecs.length || 0

    return { criticalCount, highCount, mlInsights, avgImpact: Math.round(avgImpact * 10) / 10 }
  }

  const stats = getInsightStats()

  return (
    <div className="space-y-6 animate-on-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">AI Security Insights</h2>
          <p className="text-muted-foreground mt-1">
            Machine learning-powered threat detection and security recommendations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-on-scroll" />
          Generate New Insights
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-on-scroll">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalCount}</div>
          </CardContent>
        </Card>

        <Card className="animate-on-scroll">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.highCount}</div>
          </CardContent>
        </Card>

        <Card className="animate-on-scroll">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary animate-on-scroll" />
              <div className="text-2xl font-bold text-primary">{stats.mlInsights}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-on-scroll">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Threat Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgImpact}/10</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground animate-on-scroll" />
          <span className="text-sm text-muted-foreground">Filter by:</span>
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ML Insight">AI Detection</SelectItem>
            <SelectItem value="Threat Detection">Threat Detection</SelectItem>
            <SelectItem value="Security Gap">Security Gap</SelectItem>
            <SelectItem value="Threat Prevention">Threat Prevention</SelectItem>
            <SelectItem value="Best Practice">Best Practice</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impact">Impact Score</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="date">Date Generated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="animate-on-scroll">
              <RecommendationCard recommendation={recommendation} onStatusChange={handleStatusChange} />
            </div>
          ))
        ) : (
          <Card className="animate-on-scroll">
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No security threats detected</h3>
              <p className="text-muted-foreground">
                Your systems are secure. Try adjusting filters or generate new insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
