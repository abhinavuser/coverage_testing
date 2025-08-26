"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Download, Globe } from "lucide-react"

export function SettingsModal() {
  const [notifications, setNotifications] = useState(true)
  const [autoExport, setAutoExport] = useState(false)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive email alerts for test failures</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-slate-500">Browser push notifications</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-slate-500">Automatic weekly summary emails</p>
                </div>
                <Switch id="weekly-reports" defaultChecked />
              </div>
            </div>
          </Card>

          {/* Export Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Export & Reports</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-export">Auto Export</Label>
                  <p className="text-sm text-slate-500">Automatically export reports after completion</p>
                </div>
                <Switch
                  id="auto-export"
                  checked={autoExport}
                  onCheckedChange={setAutoExport}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Default Export Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Export Location</Label>
                <Select defaultValue="local">
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Download</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Regional Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Regional</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                    <SelectItem value="CET">Central European Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500">Add an extra layer of security</p>
                </div>
                <Switch id="2fa" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

                     {/* Current Settings Summary */}
           <Card className="p-6 bg-slate-50">
             <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
             <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                 <span className="text-slate-500">Language:</span>
                 <span className="ml-2 font-medium">{language.toUpperCase()}</span>
               </div>
               <div>
                 <span className="text-slate-500">Timezone:</span>
                 <span className="ml-2 font-medium">{timezone}</span>
               </div>
               <div>
                 <span className="text-slate-500">Notifications:</span>
                 <Badge variant="secondary" className="ml-2">
                   {notifications ? "Enabled" : "Disabled"}
                 </Badge>
               </div>
               <div>
                 <span className="text-slate-500">Auto Export:</span>
                 <Badge variant="secondary" className="ml-2">
                   {autoExport ? "Enabled" : "Disabled"}
                 </Badge>
               </div>
             </div>
           </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
