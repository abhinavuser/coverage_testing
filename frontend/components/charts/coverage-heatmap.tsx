"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const heatmapData = [
  { feature: "Authentication", environments: [95, 88, 92, 85, 78, 90, 82, 88, 91] },
  { feature: "Payment", environments: [92, 95, 89, 91, 88, 93, 87, 90, 94] },
  { feature: "User Profile", environments: [78, 82, 75, 80, 72, 85, 70, 78, 83] },
  { feature: "Search", environments: [65, 70, 62, 68, 60, 72, 58, 65, 75] },
  { feature: "Notifications", environments: [45, 52, 48, 50, 42, 55, 40, 48, 58] },
  { feature: "Settings", environments: [88, 92, 85, 90, 82, 95, 80, 88, 93] },
  { feature: "Dashboard", environments: [72, 78, 70, 75, 68, 80, 65, 72, 82] },
  { feature: "Reports", environments: [55, 62, 52, 58, 48, 65, 45, 55, 68] },
]

const environments = ["Dev", "Test", "Stage", "Prod", "Mobile", "Web", "API", "DB", "CDN"]

const getCoverageColor = (coverage: number) => {
  if (coverage >= 90) return "bg-green-500"
  if (coverage >= 80) return "bg-green-400"
  if (coverage >= 70) return "bg-yellow-400"
  if (coverage >= 60) return "bg-orange-400"
  if (coverage >= 50) return "bg-red-400"
  return "bg-red-500"
}

const getCoverageOpacity = (coverage: number) => {
  return Math.max(0.3, coverage / 100)
}

export function CoverageHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Feature Coverage Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Environment headers */}
          <div className="grid grid-cols-10 gap-1 text-xs">
            <div></div>
            {environments.map((env) => (
              <div key={env} className="text-center font-medium text-muted-foreground">
                {env}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {heatmapData.map((row) => (
              <div key={row.feature} className="grid grid-cols-10 gap-1">
                <div className="text-xs font-medium text-muted-foreground py-2 pr-2 text-right">{row.feature}</div>
                {row.environments.map((coverage, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-8 rounded flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:scale-110 transition-transform",
                      getCoverageColor(coverage),
                    )}
                    style={{ opacity: getCoverageOpacity(coverage) }}
                    title={`${row.feature} - ${environments[index]}: ${coverage}%`}
                  >
                    {coverage}%
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>{"<50%"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>50-69%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>70-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>80-89%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>{"≥90%"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
