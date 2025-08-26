"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table, Calendar, Mail, Settings } from "lucide-react"

interface ExportSettings {
  scheduledReports: {
    enabled: boolean
    frequency: string
    format: string
    recipients: string[]
    includeCharts: boolean
  }
  customTemplates: {
    name: string
    sections: string[]
  }[]
}

export function ExportOptions() {
  const [settings, setSettings] = useState<ExportSettings>({
    scheduledReports: {
      enabled: false,
      frequency: "weekly",
      format: "pdf",
      recipients: ["team@company.com"],
      includeCharts: true,
    },
    customTemplates: [
      {
        name: "Executive Summary",
        sections: ["metrics", "trends", "critical-issues"],
      },
      {
        name: "Technical Report",
        sections: ["metrics", "features", "tests", "recommendations"],
      },
    ],
  })

  const [isExporting, setIsExporting] = useState(false)
  const [newRecipient, setNewRecipient] = useState("")

  const handleExport = async (format: string) => {
    setIsExporting(true)
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    // In real implementation, this would trigger the actual export
    console.log(`Exporting as ${format}`)
  }

  const addRecipient = () => {
    if (newRecipient && !settings.scheduledReports.recipients.includes(newRecipient)) {
      setSettings((prev) => ({
        ...prev,
        scheduledReports: {
          ...prev.scheduledReports,
          recipients: [...prev.scheduledReports.recipients, newRecipient],
        },
      }))
      setNewRecipient("")
    }
  }

  const removeRecipient = (email: string) => {
    setSettings((prev) => ({
      ...prev,
      scheduledReports: {
        ...prev.scheduledReports,
        recipients: prev.scheduledReports.recipients.filter((r) => r !== email),
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          <CardTitle>Export & Reporting</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Export */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Quick Export</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
            >
              <FileText className="h-6 w-6" />
              <span>Export as PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
            >
              <Table className="h-6 w-6" />
              <span>Export as CSV</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
              onClick={() => handleExport("json")}
              disabled={isExporting}
            >
              <Settings className="h-6 w-6" />
              <span>Export as JSON</span>
            </Button>
          </div>
          {isExporting && (
            <div className="text-center text-sm text-muted-foreground">
              Generating report... This may take a few moments.
            </div>
          )}
        </div>

        <Separator />

        {/* Scheduled Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Reports
            </h4>
            <Switch
              checked={settings.scheduledReports.enabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  scheduledReports: { ...prev.scheduledReports, enabled: checked },
                }))
              }
            />
          </div>

          {settings.scheduledReports.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select
                    value={settings.scheduledReports.frequency}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        scheduledReports: { ...prev.scheduledReports, frequency: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select
                    value={settings.scheduledReports.format}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        scheduledReports: { ...prev.scheduledReports, format: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="both">Both PDF & CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Add recipient email"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                  />
                  <Button onClick={addRecipient} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.scheduledReports.recipients.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {email}
                      <button onClick={() => removeRecipient(email)} className="ml-1 hover:text-destructive">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.scheduledReports.includeCharts}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      scheduledReports: { ...prev.scheduledReports, includeCharts: checked },
                    }))
                  }
                />
                <span className="text-sm">Include charts and visualizations</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Custom Templates */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Custom Report Templates</h4>
          <div className="space-y-3">
            {settings.customTemplates.map((template, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{template.name}</h5>
                  <Button variant="outline" size="sm" onClick={() => handleExport("template")}>
                    <Download className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.sections.map((section) => (
                    <Badge key={section} variant="outline" className="text-xs">
                      {section.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export History */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-sm mb-2">Recent Exports</h5>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Coverage Report - PDF</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span>Feature Data - CSV</span>
              <span>1 day ago</span>
            </div>
            <div className="flex justify-between">
              <span>Weekly Summary - PDF</span>
              <span>3 days ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
