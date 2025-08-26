"use client"

import { useState } from "react"
import BackgroundAnimation from "@/components/background-animation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText, Calendar, Filter, Search, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Sample report data
const reports = [
  {
    id: 1,
    title: "Monthly Test Coverage Report",
    type: "Coverage",
    status: "Generated",
    date: "2024-01-15",
    size: "2.4 MB",
    description: "Comprehensive monthly analysis of test coverage across all modules",
    priority: "High",
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    title: "Performance Test Results Q4",
    type: "Performance",
    status: "Pending",
    date: "2024-01-10",
    size: "1.8 MB",
    description: "Quarterly performance testing results and bottleneck analysis",
    priority: "Medium",
    lastUpdated: "1 day ago"
  },
  {
    id: 3,
    title: "Security Testing Summary",
    type: "Security",
    status: "Generated",
    date: "2024-01-08",
    size: "3.1 MB",
    description: "Security vulnerability assessment and penetration testing results",
    priority: "Critical",
    lastUpdated: "3 days ago"
  },
  {
    id: 4,
    title: "Regression Test Report",
    type: "Regression",
    status: "In Progress",
    date: "2024-01-12",
    size: "1.2 MB",
    description: "Automated regression testing results and issue tracking",
    priority: "High",
    lastUpdated: "5 hours ago"
  },
  {
    id: 5,
    title: "API Testing Coverage",
    type: "API",
    status: "Generated",
    date: "2024-01-05",
    size: "0.9 MB",
    description: "API endpoint testing coverage and response time analysis",
    priority: "Medium",
    lastUpdated: "1 week ago"
  },
  {
    id: 6,
    title: "Mobile App Test Results",
    type: "Mobile",
    status: "Generated",
    date: "2024-01-03",
    size: "2.7 MB",
    description: "Cross-platform mobile testing results and compatibility analysis",
    priority: "High",
    lastUpdated: "1 week ago"
  }
]

const reportTypes = ["All", "Coverage", "Performance", "Security", "Regression", "API", "Mobile"]
const reportStatuses = ["All", "Generated", "Pending", "In Progress"]

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === "All" || report.type === selectedType
    const matchesStatus = selectedStatus === "All" || report.status === selectedStatus
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-yellow-100 text-yellow-700"
      case "In Progress":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700"
      case "High":
        return "bg-orange-100 text-orange-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleDownload = (reportId: number) => {
    // Simulate individual report download
    console.log(`Downloading report ${reportId}`)
    // In a real app, this would trigger a file download
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = '#'; // In real app, this would be the actual file URL
      link.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
      link.click();
    }
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
            <Link href="/statistics" className="text-slate-600 hover:text-red-600 transition-colors">
              Statistics
            </Link>
            <Link href="/reports" className="text-red-600 font-semibold">
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
              <h1 className="text-5xl font-bold text-slate-800 mb-2">Test Reports</h1>
              <p className="text-xl text-slate-800">Generate, manage, and download comprehensive testing reports</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  +12%
                </Badge>
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-2">24</h4>
                                <p className="text-slate-800">Total Reports</p>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Download className="w-8 h-8 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +8%
                </Badge>
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-2">18</h4>
                                <p className="text-slate-800">Generated</p>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  -5%
                </Badge>
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-2">4</h4>
                                <p className="text-slate-800">Pending</p>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  +15%
                </Badge>
              </div>
              <h4 className="text-3xl font-bold text-slate-800 mb-2">2</h4>
                                <p className="text-slate-800">In Progress</p>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {reportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {reportStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </div>
          </Card>
        </div>

        {/* Reports List */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="p-6 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
                      <Badge variant="secondary" className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{report.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {report.size}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {report.lastUpdated}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    {report.status === "Generated" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(report.id)}
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">{report.type} Report</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {report.status === "Generated" && (
                      <Button size="sm" variant="ghost" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                    {report.status === "Pending" && (
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Activity className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                    )}
                    {report.status === "In Progress" && (
                      <Button size="sm" variant="ghost" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card className="p-12 bg-white/70 backdrop-blur-sm border-slate-200 text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No reports found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
