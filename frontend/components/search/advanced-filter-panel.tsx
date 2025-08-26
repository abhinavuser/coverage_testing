"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Filter, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterState {
  priority: string[]
  coverageRange: [number, number]
  riskLevel: number[]
  testStatus: string[]
  lastUpdated: string
  features: string[]
}

interface AdvancedFilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: FilterState) => void
  activeFilters: FilterState
}

const priorityOptions = [
  { value: "critical", label: "Critical", color: "bg-destructive" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "medium", label: "Medium", color: "bg-blue-500" },
  { value: "low", label: "Low", color: "bg-green-500" },
]

const testStatusOptions = [
  { value: "passed", label: "Passed", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-destructive" },
  { value: "not-tested", label: "Not Tested", color: "bg-yellow-500" },
  { value: "skipped", label: "Skipped", color: "bg-gray-500" },
]

const featureOptions = [
  "Authentication",
  "Payment Processing",
  "User Profile",
  "Search Functionality",
  "Notifications",
  "Settings",
  "Dashboard",
  "Reports",
  "API Integration",
  "File Upload",
]

export function AdvancedFilterPanel({ isOpen, onClose, onFiltersChange, activeFilters }: AdvancedFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(activeFilters)

  const updateFilters = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      priority: [],
      coverageRange: [0, 100],
      riskLevel: [],
      testStatus: [],
      lastUpdated: "all",
      features: [],
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priority.length > 0) count++
    if (filters.coverageRange[0] > 0 || filters.coverageRange[1] < 100) count++
    if (filters.riskLevel.length > 0) count++
    if (filters.testStatus.length > 0) count++
    if (filters.lastUpdated !== "all") count++
    if (filters.features.length > 0) count++
    return count
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border shadow-lg overflow-y-auto">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="sticky top-0 bg-background border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Advanced Filters</CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getActiveFilterCount()} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Priority Level */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Priority Level</h4>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${option.value}`}
                      checked={filters.priority.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters("priority", [...filters.priority, option.value])
                        } else {
                          updateFilters(
                            "priority",
                            filters.priority.filter((p) => p !== option.value),
                          )
                        }
                      }}
                    />
                    <label
                      htmlFor={`priority-${option.value}`}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <div className={cn("w-3 h-3 rounded", option.color)}></div>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Coverage Range */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Coverage Range</h4>
              <div className="space-y-4">
                <Slider
                  value={filters.coverageRange}
                  onValueChange={(value) => updateFilters("coverageRange", value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{filters.coverageRange[0]}%</span>
                  <span>{filters.coverageRange[1]}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={filters.coverageRange[0] === 0 && filters.coverageRange[1] === 59 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters("coverageRange", [0, 59])}
                  >
                    0-59%
                  </Button>
                  <Button
                    variant={filters.coverageRange[0] === 60 && filters.coverageRange[1] === 79 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters("coverageRange", [60, 79])}
                  >
                    60-79%
                  </Button>
                  <Button
                    variant={
                      filters.coverageRange[0] === 80 && filters.coverageRange[1] === 100 ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => updateFilters("coverageRange", [80, 100])}
                  >
                    80%+
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Risk Level */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Risk Level</h4>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={filters.riskLevel.includes(level) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (filters.riskLevel.includes(level)) {
                        updateFilters(
                          "riskLevel",
                          filters.riskLevel.filter((r) => r !== level),
                        )
                      } else {
                        updateFilters("riskLevel", [...filters.riskLevel, level])
                      }
                    }}
                  >
                    {Array.from({ length: level }, (_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Test Status */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Test Status</h4>
              <div className="space-y-2">
                {testStatusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filters.testStatus.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters("testStatus", [...filters.testStatus, option.value])
                        } else {
                          updateFilters(
                            "testStatus",
                            filters.testStatus.filter((s) => s !== option.value),
                          )
                        }
                      }}
                    />
                    <label
                      htmlFor={`status-${option.value}`}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <div className={cn("w-3 h-3 rounded", option.color)}></div>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Last Updated */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Last Updated</h4>
              <Select value={filters.lastUpdated} onValueChange={(value) => updateFilters("lastUpdated", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Features</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {featureOptions.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters("features", [...filters.features, feature])
                        } else {
                          updateFilters(
                            "features",
                            filters.features.filter((f) => f !== feature),
                          )
                        }
                      }}
                    />
                    <label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
