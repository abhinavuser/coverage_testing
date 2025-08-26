"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FeatureCard } from "./feature-card"
import { FeatureListItem } from "./feature-list-item"
import { FeatureDetailModal } from "./feature-detail-modal"
import { Grid3X3, List, Search } from "lucide-react"

const mockFeatures = [
  {
    id: "1",
    name: "Firewall Protection",
    coverage: 95,
    riskLevel: 5,
    testCount: 42,
    lastUpdated: "2h ago",
    status: "good" as const,
    trend: "up" as const,
    description: "Advanced firewall rules and network protection",
  },
  {
    id: "2",
    name: "Intrusion Detection",
    coverage: 88,
    riskLevel: 4,
    testCount: 38,
    lastUpdated: "1h ago",
    status: "good" as const,
    trend: "up" as const,
    description: "Real-time threat detection and prevention",
  },
  {
    id: "3",
    name: "Data Encryption",
    coverage: 92,
    riskLevel: 5,
    testCount: 25,
    lastUpdated: "4h ago",
    status: "good" as const,
    trend: "stable" as const,
    description: "End-to-end data encryption and key management",
  },
  {
    id: "4",
    name: "Access Control",
    coverage: 78,
    riskLevel: 3,
    testCount: 18,
    lastUpdated: "6h ago",
    status: "warning" as const,
    trend: "down" as const,
    description: "User authentication and authorization systems",
  },
  {
    id: "5",
    name: "Vulnerability Scanning",
    coverage: 65,
    riskLevel: 4,
    testCount: 12,
    lastUpdated: "1d ago",
    status: "warning" as const,
    trend: "down" as const,
    description: "Automated security vulnerability assessment",
  },
  {
    id: "6",
    name: "Incident Response",
    coverage: 45,
    riskLevel: 2,
    testCount: 22,
    lastUpdated: "3h ago",
    status: "critical" as const,
    trend: "up" as const,
    description: "Security incident management and response protocols",
  },
]

export function FeaturesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeature, setSelectedFeature] = useState<(typeof mockFeatures)[0] | null>(null)

  const filteredFeatures = mockFeatures.filter((feature) => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || feature.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleFeatureClick = (featureId: string) => {
    const feature = mockFeatures.find((f) => f.id === featureId)
    setSelectedFeature(feature || null)
  }

  return (
    <div className="space-y-6 animate-on-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Security Features</h2>
          <p className="text-muted-foreground mt-1">Monitor and manage cybersecurity protection levels</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-on-scroll" />
            <Input
              placeholder="Search security features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="good">Secure</SelectItem>
              <SelectItem value="warning">At Risk</SelectItem>
              <SelectItem value="critical">Vulnerable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4 animate-on-scroll" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4 animate-on-scroll" />
          </Button>
        </div>
      </div>

      {/* Features Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="animate-on-scroll">
              <FeatureCard feature={feature} onClick={handleFeatureClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="animate-on-scroll">
              <FeatureListItem feature={feature} onClick={handleFeatureClick} />
            </div>
          ))}
        </div>
      )}

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </div>
  )
}
