"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Webhook, AlertTriangle, Save } from "lucide-react"

interface AlertSettings {
  coverageThresholds: {
    critical: number
    warning: number
    enabled: boolean
  }
  riskLevelAlerts: {
    threshold: number
    enabled: boolean
  }
  notifications: {
    email: {
      enabled: boolean
      address: string
      frequency: string
    }
    webhook: {
      enabled: boolean
      url: string
    }
  }
  alertFrequency: string
}

export function AlertConfiguration() {
  const [settings, setSettings] = useState<AlertSettings>({
    coverageThresholds: {
      critical: 50,
      warning: 70,
      enabled: true,
    },
    riskLevelAlerts: {
      threshold: 4,
      enabled: true,
    },
    notifications: {
      email: {
        enabled: true,
        address: "team@company.com",
        frequency: "immediate",
      },
      webhook: {
        enabled: false,
        url: "",
      },
    },
    alertFrequency: "immediate",
  })

  const [isSaving, setIsSaving] = useState(false)

  const updateSettings = (path: string[], value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev }
      let current: any = newSettings
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newSettings
    })
  }

  const saveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Alert Configuration</CardTitle>
          </div>
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coverage Threshold Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Coverage Threshold Alerts</h4>
            <Switch
              checked={settings.coverageThresholds.enabled}
              onCheckedChange={(checked) => updateSettings(["coverageThresholds", "enabled"], checked)}
            />
          </div>
          {settings.coverageThresholds.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Critical threshold:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.coverageThresholds.critical}
                    onChange={(e) =>
                      updateSettings(["coverageThresholds", "critical"], Number.parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Warning threshold:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.coverageThresholds.warning}
                    onChange={(e) =>
                      updateSettings(["coverageThresholds", "warning"], Number.parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Risk Level Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Risk Level Alerts</h4>
            <Switch
              checked={settings.riskLevelAlerts.enabled}
              onCheckedChange={(checked) => updateSettings(["riskLevelAlerts", "enabled"], checked)}
            />
          </div>
          {settings.riskLevelAlerts.enabled && (
            <div className="pl-4 border-l-2 border-primary/20">
              <div className="flex items-center gap-4">
                <span className="text-sm">Alert when risk level reaches:</span>
                <Select
                  value={settings.riskLevelAlerts.threshold.toString()}
                  onValueChange={(value) => updateSettings(["riskLevelAlerts", "threshold"], Number.parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {Array.from({ length: level }, () => "★").join("")} ({level}/5)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Notification Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Notification Settings</h4>

          {/* Email Notifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.email.enabled}
                onCheckedChange={(checked) => updateSettings(["notifications", "email", "enabled"], checked)}
              />
            </div>
            {settings.notifications.email.enabled && (
              <div className="space-y-3 pl-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm w-20">Email:</span>
                  <Input
                    type="email"
                    value={settings.notifications.email.address}
                    onChange={(e) => updateSettings(["notifications", "email", "address"], e.target.value)}
                    placeholder="team@company.com"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm w-20">Frequency:</span>
                  <Select
                    value={settings.notifications.email.frequency}
                    onValueChange={(value) => updateSettings(["notifications", "email", "frequency"], value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Webhook Notifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                <span className="text-sm">Webhook Notifications</span>
              </div>
              <Switch
                checked={settings.notifications.webhook.enabled}
                onCheckedChange={(checked) => updateSettings(["notifications", "webhook", "enabled"], checked)}
              />
            </div>
            {settings.notifications.webhook.enabled && (
              <div className="pl-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm w-20">URL:</span>
                  <Input
                    type="url"
                    value={settings.notifications.webhook.url}
                    onChange={(e) => updateSettings(["notifications", "webhook", "url"], e.target.value)}
                    placeholder="https://your-webhook-url.com/alerts"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alert Status */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-sm mb-2">Active Alerts</h5>
          <div className="flex flex-wrap gap-2">
            {settings.coverageThresholds.enabled && <Badge variant="secondary">Coverage Thresholds</Badge>}
            {settings.riskLevelAlerts.enabled && <Badge variant="secondary">Risk Level Alerts</Badge>}
            {settings.notifications.email.enabled && <Badge variant="secondary">Email Notifications</Badge>}
            {settings.notifications.webhook.enabled && <Badge variant="secondary">Webhook Notifications</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
