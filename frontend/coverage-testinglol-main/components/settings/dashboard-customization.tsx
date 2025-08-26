"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Palette, Layout, Eye, EyeOff, RotateCcw } from "lucide-react"

interface DashboardSettings {
  theme: "light" | "dark" | "system"
  visibleMetrics: string[]
  chartTypes: Record<string, string>
  widgetOrder: string[]
}

const availableMetrics = [
  { id: "overall", label: "Overall Score", description: "Main coverage percentage" },
  { id: "functional", label: "Functional Coverage", description: "Function-level test coverage" },
  { id: "risk", label: "Risk Coverage", description: "High-risk area coverage" },
  { id: "userJourney", label: "User Journey Coverage", description: "End-to-end journey coverage" },
  { id: "data", label: "Data Coverage", description: "Data validation coverage" },
  { id: "environmental", label: "Environmental Coverage", description: "Multi-environment coverage" },
]

const chartTypeOptions = [
  { value: "line", label: "Line Chart" },
  { value: "bar", label: "Bar Chart" },
  { value: "area", label: "Area Chart" },
]

export function DashboardCustomization() {
  const [settings, setSettings] = useState<DashboardSettings>({
    theme: "dark",
    visibleMetrics: ["overall", "functional", "risk", "userJourney", "data", "environmental"],
    chartTypes: {
      trends: "line",
      breakdown: "bar",
      distribution: "pie",
    },
    widgetOrder: ["metrics", "trends", "insights", "features"],
  })

  const updateSettings = (key: keyof DashboardSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const toggleMetricVisibility = (metricId: string) => {
    const newVisibleMetrics = settings.visibleMetrics.includes(metricId)
      ? settings.visibleMetrics.filter((id) => id !== metricId)
      : [...settings.visibleMetrics, metricId]
    updateSettings("visibleMetrics", newVisibleMetrics)
  }

  const resetToDefaults = () => {
    setSettings({
      theme: "dark",
      visibleMetrics: ["overall", "functional", "risk", "userJourney", "data", "environmental"],
      chartTypes: {
        trends: "line",
        breakdown: "bar",
        distribution: "pie",
      },
      widgetOrder: ["metrics", "trends", "insights", "features"],
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            <CardTitle>Dashboard Customization</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color Theme
          </h4>
          <Select value={settings.theme} onValueChange={(value: any) => updateSettings("theme", value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light Mode</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="system">System Default</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Visible Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Visible Metrics</h4>
          <p className="text-sm text-muted-foreground">Choose which metrics to display on your dashboard</p>
          <div className="space-y-3">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settings.visibleMetrics.includes(metric.id)}
                    onCheckedChange={() => toggleMetricVisibility(metric.id)}
                  />
                  <div>
                    <div className="font-medium text-sm">{metric.label}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <Badge variant={settings.visibleMetrics.includes(metric.id) ? "default" : "secondary"}>
                  {settings.visibleMetrics.includes(metric.id) ? (
                    <Eye className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-1" />
                  )}
                  {settings.visibleMetrics.includes(metric.id) ? "Visible" : "Hidden"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Chart Type Preferences */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Chart Type Preferences</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Coverage Trends</span>
              <Select
                value={settings.chartTypes.trends}
                onValueChange={(value) => updateSettings("chartTypes", { ...settings.chartTypes, trends: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Feature Breakdown</span>
              <Select
                value={settings.chartTypes.breakdown}
                onValueChange={(value) => updateSettings("chartTypes", { ...settings.chartTypes, breakdown: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
