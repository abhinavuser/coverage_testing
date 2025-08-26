"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertTriangle, CheckCircle, XCircle, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureDetailModalProps {
  isOpen: boolean
  onClose: () => void
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
  } | null
}

const mockTestCases = [
  { id: 1, name: "User login with valid credentials", status: "passed", lastRun: "2 hours ago" },
  { id: 2, name: "User login with invalid password", status: "passed", lastRun: "2 hours ago" },
  { id: 3, name: "Password reset functionality", status: "failed", lastRun: "1 day ago" },
  { id: 4, name: "Multi-factor authentication", status: "not-tested", lastRun: "Never" },
  { id: 5, name: "Session timeout handling", status: "passed", lastRun: "3 hours ago" },
]

const mockRecommendations = [
  {
    type: "Critical Gap",
    title: "Add edge case testing",
    description: "Missing tests for boundary conditions and error scenarios",
    impact: "High",
    effort: "Medium",
  },
  {
    type: "Performance",
    title: "Load testing needed",
    description: "No performance tests for concurrent user scenarios",
    impact: "Medium",
    effort: "High",
  },
  {
    type: "Security",
    title: "Security vulnerability tests",
    description: "Add tests for common security vulnerabilities",
    impact: "High",
    effort: "Low",
  },
]

export function FeatureDetailModal({ isOpen, onClose, feature }: FeatureDetailModalProps) {
  if (!feature) return null

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

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "not-tested":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getRiskStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn("text-lg", i < level ? "text-yellow-500" : "text-muted-foreground")}>
        ★
      </span>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">{feature.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={cn("text-2xl font-bold", getStatusColor(feature.status))}>{feature.coverage}%</div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                  <Progress value={feature.coverage} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">{getRiskStars(feature.riskLevel)}</div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{feature.testCount}</div>
                  <div className="text-xs text-muted-foreground">Total Tests</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{feature.lastUpdated}</div>
                  <div className="text-xs text-muted-foreground">Last Updated</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              <div className="space-y-2">
                {mockTestCases.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTestStatusIcon(test.status)}
                      <div>
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="text-xs text-muted-foreground">Last run: {test.lastRun}</div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        test.status === "passed" ? "default" : test.status === "failed" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                {mockRecommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Impact: {rec.impact}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Effort: {rec.effort}
                          </Badge>
                        </div>
                      </div>
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <p>Coverage history timeline coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
