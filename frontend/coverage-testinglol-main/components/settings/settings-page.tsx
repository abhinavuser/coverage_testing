"use client"

import { DashboardCustomization } from "./dashboard-customization"
import { AlertConfiguration } from "./alert-configuration"
import { ExportOptions } from "./export-options"

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-on-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Security Settings</h2>
          <p className="text-muted-foreground mt-1">
            Configure your security dashboard, threat alerts, and reporting preferences
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        <div className="animate-on-scroll">
          <DashboardCustomization />
        </div>
        <div className="animate-on-scroll">
          <AlertConfiguration />
        </div>
        <div className="animate-on-scroll">
          <ExportOptions />
        </div>
      </div>
    </div>
  )
}
