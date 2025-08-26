"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GlobalSearch } from "@/components/search/global-search"
import { AdvancedFilterPanel } from "@/components/search/advanced-filter-panel"
import { RefreshCw, Download, Settings, Shield, TrendingUp, Brain, Bell, ShieldCheck } from "lucide-react"

const tabs = [
  { id: "overview", label: "Security Dashboard", icon: Shield },
  { id: "features", label: "Security Features", icon: ShieldCheck },
  { id: "trends", label: "Threat Trends", icon: TrendingUp },
  { id: "ai-insights", label: "AI Security Insights", icon: Brain },
  { id: "settings", label: "Settings", icon: Settings },
]

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    priority: [] as string[],
    coverageRange: [0, 100] as [number, number],
    riskLevel: [] as number[],
    testStatus: [] as string[],
    lastUpdated: "all",
    features: [] as string[],
  })

  const hasActiveFilters = () => {
    return (
      activeFilters.priority.length > 0 ||
      activeFilters.coverageRange[0] > 0 ||
      activeFilters.coverageRange[1] < 100 ||
      activeFilters.riskLevel.length > 0 ||
      activeFilters.testStatus.length > 0 ||
      activeFilters.lastUpdated !== "all" ||
      activeFilters.features.length > 0
    )
  }

  return (
    <div className="border-b border-border bg-card">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">CyberGuard Analytics</h1>
          </div>

          <Select defaultValue="main-infrastructure">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select infrastructure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main-infrastructure">Main Infrastructure</SelectItem>
              <SelectItem value="web-applications">Web Applications</SelectItem>
              <SelectItem value="mobile-security">Mobile Security</SelectItem>
              <SelectItem value="api-endpoints">API Endpoints</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-96">
            <GlobalSearch onFilterToggle={() => setShowFilters(!showFilters)} hasActiveFilters={hasActiveFilters()} />
          </div>

          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Now
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Security Report PDF</DropdownMenuItem>
              <DropdownMenuItem>Vulnerability CSV</DropdownMenuItem>
              <DropdownMenuItem>Schedule Security Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.id === "ai-insights" && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    3
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <AdvancedFilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={setActiveFilters}
        activeFilters={activeFilters}
      />
    </div>
  )
}
