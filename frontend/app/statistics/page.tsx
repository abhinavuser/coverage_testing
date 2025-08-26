"use client"

import { useState } from "react"
import BackgroundAnimation from "@/components/background-animation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// Sample data for statistics
const testExecutionData = [
  { month: "Jan", passed: 85, failed: 15, skipped: 5, total: 105 },
  { month: "Feb", passed: 92, failed: 8, skipped: 3, total: 103 },
  { month: "Mar", passed: 88, failed: 12, skipped: 4, total: 104 },
  { month: "Apr", passed: 95, failed: 5, skipped: 2, total: 102 },
  { month: "May", passed: 98, failed: 2, skipped: 1, total: 101 },
  { month: "Jun", passed: 96, failed: 4, skipped: 2, total: 102 },
]

const performanceData = [
  { test: "Login Flow", avgTime: 2.3, maxTime: 5.1, minTime: 1.8, success: 98 },
  { test: "Payment Process", avgTime: 4.2, maxTime: 8.9, minTime: 3.1, success: 95 },
  { test: "Data Export", avgTime: 6.8, maxTime: 12.4, minTime: 5.2, success: 92 },
  { test: "Search API", avgTime: 1.9, maxTime: 3.7, minTime: 1.2, success: 99 },
  { test: "File Upload", avgTime: 8.5, maxTime: 15.2, minTime: 6.8, success: 89 },
  { test: "Report Generation", avgTime: 12.3, maxTime: 18.9, minTime: 9.8, success: 87 },
]

const coverageTrends = [
  { week: "W1", unit: 75, integration: 68, e2e: 45, functional: 82 },
  { week: "W2", unit: 78, integration: 72, e2e: 52, functional: 85 },
  { week: "W3", unit: 82, integration: 76, e2e: 58, functional: 88 },
  { week: "W4", unit: 85, integration: 79, e2e: 62, functional: 90 },
  { week: "W5", unit: 88, integration: 82, e2e: 68, functional: 92 },
  { week: "W6", unit: 91, integration: 85, e2e: 72, functional: 94 },
  { week: "W7", unit: 93, integration: 88, e2e: 76, functional: 95 },
  { week: "W8", unit: 95, integration: 91, e2e: 80, functional: 96 },
]

const issueDistribution = [
  { type: "Critical", count: 3, percentage: 5, color: "#ef4444" },
  { type: "High", count: 12, percentage: 20, color: "#f59e0b" },
  { type: "Medium", count: 25, percentage: 42, color: "#3b82f6" },
  { type: "Low", count: 20, percentage: 33, color: "#10b981" },
]

export default function StatisticsPage() {
  const [activeMetric, setActiveMetric] = useState("execution")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">TestGuard Pro</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 mx-auto">
            <Link href="/analytics" className="text-slate-600 hover:text-red-600 transition-colors">
              Analytics
            </Link>
            <Link href="/statistics" className="text-red-600 font-semibold">
              Statistics
            </Link>
            <Link href="/reports" className="text-slate-600 hover:text-red-600 transition-colors">
              Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-800 mb-2">Testing Statistics</h1>
              <p className="text-xl text-slate-800">Detailed metrics and performance analysis</p>
            </div>
          </div>
        </div>

        {/* Metric Navigation */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-slate-200">
            <Button
              variant={activeMetric === "execution" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric("execution")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Test Execution
            </Button>
            <Button
              variant={activeMetric === "performance" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric("performance")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Performance
            </Button>
            <Button
              variant={activeMetric === "coverage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric("coverage")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Coverage Trends
            </Button>
            <Button
              variant={activeMetric === "issues" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric("issues")}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Issue Analysis
            </Button>
          </div>
        </div>

        {/* Statistics Content */}
        <div className="max-w-7xl mx-auto px-6">
          {activeMetric === "execution" && (
            <div className="space-y-8">
              {/* Test Execution Overview */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Test Execution Overview</h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={testExecutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="passed" fill="#10b981" name="Passed" />
                      <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                      <Bar dataKey="skipped" fill="#f59e0b" name="Skipped" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Success Rate Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      +5.2%
                    </Badge>
                  </div>
                  <h4 className="text-3xl font-bold text-slate-800 mb-2">96.8%</h4>
                  <p className="text-slate-800">Success Rate</p>
                </Card>

                <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      -12.5%
                    </Badge>
                  </div>
                  <h4 className="text-3xl font-bold text-slate-800 mb-2">2.8%</h4>
                  <p className="text-slate-800">Failure Rate</p>
                </Card>

                <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      -8.3%
                    </Badge>
                  </div>
                  <h4 className="text-3xl font-bold text-slate-800 mb-2">0.4%</h4>
                  <p className="text-slate-800">Skip Rate</p>
                </Card>
              </div>
            </div>
          )}

          {activeMetric === "performance" && (
            <div className="space-y-8">
              {/* Performance Metrics */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Test Performance Analysis</h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="test" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="avgTime" fill="#8b5cf6" name="Avg Time (s)" />
                      <Bar dataKey="maxTime" fill="#ef4444" name="Max Time (s)" />
                      <Bar dataKey="minTime" fill="#10b981" name="Min Time (s)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-slate-800 mb-4">Fastest Tests</h4>
                  <div className="space-y-3">
                    {performanceData
                      .sort((a, b) => a.avgTime - b.avgTime)
                      .slice(0, 3)
                      .map((test, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-600">{test.test}</span>
                          <span className="font-semibold text-slate-800">{test.avgTime}s</span>
                        </div>
                      ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-xl font-bold text-slate-800 mb-4">Slowest Tests</h4>
                  <div className="space-y-3">
                    {performanceData
                      .sort((a, b) => b.avgTime - a.avgTime)
                      .slice(0, 3)
                      .map((test, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-600">{test.test}</span>
                          <span className="font-semibold text-slate-800">{test.avgTime}s</span>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeMetric === "coverage" && (
            <div className="space-y-8">
              {/* Coverage Trends */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Coverage Trends by Test Type</h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coverageTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="unit" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="integration" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="e2e" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="functional" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Coverage Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { name: "Unit Tests", value: 95, color: "#ef4444", trend: "+2.1%" },
                  { name: "Integration", value: 91, color: "#3b82f6", trend: "+1.8%" },
                  { name: "E2E Tests", value: 80, color: "#10b981", trend: "+3.2%" },
                  { name: "Functional", value: 96, color: "#f59e0b", trend: "+1.5%" },
                ].map((item, index) => (
                  <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color }}></div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {item.trend}
                      </Badge>
                    </div>
                    <h4 className="text-3xl font-bold text-slate-800 mb-2">{item.value}%</h4>
                    <p className="text-slate-600">{item.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeMetric === "issues" && (
            <div className="space-y-8">
              {/* Issue Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
                    <h3 className="text-2xl font-bold text-slate-800">Issue Distribution</h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={issueDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="count"
                        >
                          {issueDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <Activity className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-slate-800">Issue Breakdown</h3>
                  </div>
                  <div className="space-y-4">
                    {issueDistribution.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: issue.color }}></div>
                          <span className="text-slate-700 font-medium">{issue.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-800">{issue.count} issues</div>
                          <div className="text-sm text-slate-500">{issue.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Issue Trends */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Issue Resolution Trends</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={testExecutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} name="Failed Tests" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
