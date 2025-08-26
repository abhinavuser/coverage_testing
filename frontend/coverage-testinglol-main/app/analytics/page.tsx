"use client"

import { useState } from "react"
import BackgroundAnimation from "@/components/background-animation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gauge, TrendingUp, Map, Target, Activity } from "lucide-react"
import Link from "next/link"
import {
  PieChart,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

// Sample data
const coverageData = [
  { name: "Functional", value: 85, color: "#ef4444", risk: "Low" },
  { name: "Integration", value: 92, color: "#3b82f6", risk: "Low" },
  { name: "Unit", value: 78, color: "#10b981", risk: "Medium" },
  { name: "E2E", value: 65, color: "#f59e0b", risk: "High" },
  { name: "Performance", value: 88, color: "#8b5cf6", risk: "Low" },
  { name: "Security", value: 95, color: "#06b6d4", risk: "Low" },
]

// Priority vs Status Heatmap Data
const priorityStatusData = [
  { priority: "Critical", status: "Open", count: 15, intensity: 0.9 },
  { priority: "Critical", status: "In Progress", count: 8, intensity: 0.7 },
  { priority: "Critical", status: "Resolved", count: 3, intensity: 0.3 },
  { priority: "Critical", status: "Closed", count: 1, intensity: 0.1 },
  { priority: "High", status: "Open", count: 28, intensity: 0.8 },
  { priority: "High", status: "In Progress", count: 22, intensity: 0.6 },
  { priority: "High", status: "Resolved", count: 18, intensity: 0.4 },
  { priority: "High", status: "Closed", count: 12, intensity: 0.2 },
  { priority: "Medium", status: "Open", count: 45, intensity: 0.6 },
  { priority: "Medium", status: "In Progress", count: 38, intensity: 0.5 },
  { priority: "Medium", status: "Resolved", count: 42, intensity: 0.3 },
  { priority: "Medium", status: "Closed", count: 35, intensity: 0.2 },
  { priority: "Low", status: "Open", count: 62, intensity: 0.4 },
  { priority: "Low", status: "In Progress", count: 55, intensity: 0.3 },
  { priority: "Low", status: "Resolved", count: 68, intensity: 0.2 },
  { priority: "Low", status: "Closed", count: 58, intensity: 0.1 },
]

const trendData = [
  { month: "Jan", coverage: 65, tests: 120, issues: 15 },
  { month: "Feb", coverage: 72, tests: 145, issues: 12 },
  { month: "Mar", coverage: 78, tests: 180, issues: 10 },
  { month: "Apr", coverage: 85, tests: 220, issues: 8 },
  { month: "May", coverage: 89, tests: 280, issues: 6 },
  { month: "Jun", coverage: 94, tests: 350, issues: 4 },
  { month: "Jul", coverage: 91, tests: 320, issues: 5 },
  { month: "Aug", coverage: 96, tests: 380, issues: 3 },
]

const enhancedTrendData = [
  { month: "Jan", coverage: 65, tests: 120, issues: 15, deployments: 8, performance: 78 },
  { month: "Feb", coverage: 72, tests: 145, issues: 12, deployments: 12, performance: 82 },
  { month: "Mar", coverage: 78, tests: 180, issues: 10, deployments: 15, performance: 85 },
  { month: "Apr", coverage: 85, tests: 220, issues: 8, deployments: 18, performance: 88 },
  { month: "May", coverage: 89, tests: 280, issues: 6, deployments: 22, performance: 91 },
  { month: "Jun", coverage: 94, tests: 350, issues: 4, deployments: 25, performance: 94 },
  { month: "Jul", coverage: 91, tests: 320, issues: 5, deployments: 23, performance: 92 },
  { month: "Aug", coverage: 96, tests: 380, issues: 3, deployments: 28, performance: 96 },
]

const clusterRiskData = [
  { x: 45, y: 15, name: "Payment Processing", risk: "Critical", coverage: 45, issues: 15, area: "Backend" },
  { x: 55, y: 25, name: "Search Engine", risk: "High", coverage: 55, issues: 12, area: "Frontend" },
  { x: 65, y: 25, name: "API Integration", risk: "High", coverage: 65, issues: 10, area: "Backend" },
  { x: 72, y: 50, name: "Data Export", risk: "Medium", coverage: 72, issues: 8, area: "Backend" },
  { x: 78, y: 50, name: "File Upload", risk: "Medium", coverage: 78, issues: 6, area: "Frontend" },
  { x: 82, y: 75, name: "Email System", risk: "Low", coverage: 82, issues: 4, area: "Backend" },
  { x: 88, y: 75, name: "User Auth", risk: "Low", coverage: 88, issues: 3, area: "Security" },
  { x: 95, y: 85, name: "UI Components", risk: "Low", coverage: 95, issues: 2, area: "Frontend" },
]

export default function AnalyticsPage() {
  const [activeChart, setActiveChart] = useState("coverage")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p>Coverage: {data.x}%</p>
          <p>Issues: {data.y}</p>
          <p>Risk Level: {data.risk}</p>
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

          <div className="flex items-center space-x-6 mx-auto">
            <Link href="/analytics" className="text-red-600 font-semibold">
              Analytics
            </Link>
            <Link href="/statistics" className="text-slate-600 hover:text-red-600 transition-colors">
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
        <div className="max-w-7xl mx-auto px-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
              <p className="text-xl text-slate-800">Comprehensive testing insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Chart Navigation */}
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <div className="flex space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 border border-slate-200 overflow-x-auto">
            <Button
              variant={activeChart === "coverage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("coverage")}
              className={activeChart === "coverage" ? "" : "text-slate-800 hover:text-red-600"}
            >
              <Gauge className="w-4 h-4 mr-2" />
              Coverage
            </Button>
            <Button
              variant={activeChart === "trends" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("trends")}
              className={activeChart === "trends" ? "" : "text-slate-800 hover:text-red-600"}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends
            </Button>
            <Button
              variant={activeChart === "cluster" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("cluster")}
              className={activeChart === "cluster" ? "" : "text-slate-800 hover:text-red-600"}
            >
              <Map className="w-4 h-4 mr-2" />
              Risk Clusters
            </Button>
            <Button
              variant={activeChart === "priority" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveChart("priority")}
              className={activeChart === "priority" ? "" : "text-slate-800 hover:text-red-600"}
            >
              <Target className="w-4 h-4 mr-2" />
              Priority Heatmap
            </Button>
          </div>
        </div>

        {/* Charts */}
        <div className="max-w-7xl mx-auto px-8">
          {activeChart === "coverage" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overall Coverage Gauge */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Gauge className="w-8 h-8 text-red-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Overall Coverage</h3>
                </div>
                <div className="h-80 flex items-center justify-center">
                  {/* Custom Gauge Meter */}
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      
                      {/* Progress Arc - 94% of full circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.94)}`}
                        className="transition-all duration-1000 ease-out"
                        transform="rotate(-90 50 50)"
                      />
                      
                      {/* Percentage Text */}
                      <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        style={{ fontSize: '11px', fontWeight: '500' }}
                        fill="#64748b"
                      >
                        94.2%
                      </text>
                    </svg>
                  </div>
                </div>
                
                {/* Coverage Breakdown */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Coverage by Test Type</h4>
                  <div className="space-y-3">
                    {coverageData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                          <span className="text-slate-600 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">{item.value}%</div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              item.risk === "High" ? "bg-red-100 text-red-700" :
                              item.risk === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.risk} Risk
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Coverage Distribution */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Activity className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Coverage Distribution</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coverageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeChart === "trends" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Coverage Trends */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Coverage Improvement Over Time</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enhancedTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="coverage" stroke="#ef4444" strokeWidth={4} name="Coverage %" />
                      <Line type="monotone" dataKey="performance" stroke="#8b5cf6" strokeWidth={2} name="Performance" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-green-600">+34%</div>
                  <div className="text-sm text-slate-600">Coverage improvement since January</div>
                </div>
              </Card>

              {/* Test Execution Trends */}
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Activity className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-800">Test Execution & Deployment</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enhancedTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="tests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Tests Count" />
                      <Area type="monotone" dataKey="deployments" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Deployments" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">+330</div>
                  <div className="text-sm text-slate-600">Additional tests since January</div>
                </div>
              </Card>
            </div>
          )}

          {activeChart === "cluster" && (
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <Map className="w-8 h-8 text-indigo-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-800">Risk Cluster Analysis</h3>
              </div>
              
              {/* XY Plane Cluster Map */}
              <div className="relative h-96 bg-slate-50 rounded-lg border border-slate-200">
                {/* Grid Lines */}
                <div className="absolute inset-0">
                  {/* Vertical grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((x) => (
                    <div
                      key={`v-${x}`}
                      className="absolute top-0 bottom-0 w-px bg-slate-200"
                      style={{ left: `${x}%` }}
                    />
                  ))}
                  {/* Horizontal grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((y) => (
                    <div
                      key={`h-${y}`}
                      className="absolute left-0 right-0 h-px bg-slate-200"
                      style={{ top: `${y}%` }}
                    />
                  ))}
                </div>
                
                {/* Risk Zone Backgrounds */}
                <div className="absolute inset-0">
                  {/* High Risk Zone (Red) - Top */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-red-50 border-t-2 border-red-200"></div>
                  {/* Medium Risk Zone (Yellow) - Middle */}
                  <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-50 border-t border-yellow-200 border-b border-yellow-200"></div>
                  {/* Low Risk Zone (Green) - Bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-50 border-b-2 border-green-200"></div>
                </div>
                
                {/* Risk Cluster Points */}
                {clusterRiskData.map((point, index) => {
                  let riskColor, riskSize, riskBorder;
                  switch (point.risk) {
                    case "Critical":
                      riskColor = "bg-red-600";
                      riskBorder = "border-red-800";
                      riskSize = "w-8 h-8";
                      break;
                    case "High":
                      riskColor = "bg-orange-500";
                      riskBorder = "border-orange-700";
                      riskSize = "w-6 h-6";
                      break;
                    case "Medium":
                      riskColor = "bg-yellow-500";
                      riskBorder = "border-yellow-700";
                      riskSize = "w-5 h-5";
                      break;
                    case "Low":
                      riskColor = "bg-green-500";
                      riskBorder = "border-green-700";
                      riskSize = "w-4 h-4";
                      break;
                    default:
                      riskColor = "bg-gray-500";
                      riskBorder = "border-gray-700";
                      riskSize = "w-4 h-4";
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`absolute ${riskColor} ${riskBorder} border-2 rounded-full text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-125 hover:z-10 group ${riskSize} shadow-lg`}
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {point.coverage}%
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-20">
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm whitespace-nowrap">
                          <p className="font-semibold">{point.name}</p>
                          <p className="text-xs text-slate-500">Coverage: {point.coverage}%</p>
                          <p className="text-xs text-slate-500">Issues: {point.issues}</p>
                          <p className="text-xs text-slate-500">Area: {point.area}</p>
                          <p className="text-xs text-slate-500">Risk: {point.risk}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Zone Labels */}
                <div className="absolute top-2 left-2 bg-red-100 border border-red-300 rounded-lg p-2 shadow-lg">
                  <div className="text-sm font-semibold text-red-900">High Risk Zone</div>
                  <div className="text-xs text-red-700">Coverage &lt;60%</div>
                </div>
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-100 border border-yellow-300 rounded-lg p-2 shadow-lg">
                  <div className="text-sm font-semibold text-yellow-900">Medium Risk Zone</div>
                  <div className="text-xs text-yellow-700">Coverage 60-80%</div>
                </div>
                <div className="absolute bottom-2 left-2 bg-green-100 border border-green-300 rounded-lg p-2 shadow-lg">
                  <div className="text-sm font-semibold text-green-900">Low Risk Zone</div>
                  <div className="text-xs text-green-700">Coverage &gt;80%</div>
                </div>
                
                {/* X and Y Axis Labels */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 text-sm font-semibold text-black bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200">
                  Coverage Percentage (%)
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -rotate-90 text-sm font-semibold text-black bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200">
                  Risk Level
                </div>
              </div>
            </Card>
                     )}

           {activeChart === "priority" && (
             <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300">
               <div className="flex items-center mb-6">
                 <Target className="w-8 h-8 text-red-600 mr-3" />
                 <h3 className="text-2xl font-bold text-slate-800">Priority vs Status Heatmap</h3>
               </div>
               
               {/* Priority Heatmap */}
               <div className="relative">
                 {/* Heatmap Grid */}
                 <div className="grid grid-cols-5 gap-1 mb-4">
                   {/* Header Row - Status */}
                   <div className="h-8"></div> {/* Empty corner */}
                   <div className="h-8 flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 rounded">Open</div>
                   <div className="h-8 flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 rounded">In Progress</div>
                   <div className="h-8 flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 rounded">Resolved</div>
                   <div className="h-8 flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 rounded">Closed</div>
                   
                   {/* Priority Rows */}
                   {["Critical", "High", "Medium", "Low"].map((priority) => (
                     <div key={priority} className="contents">
                       {/* Priority Label */}
                       <div className="h-16 flex items-center justify-center text-sm font-semibold text-slate-700 bg-slate-100 rounded">
                         {priority}
                       </div>
                       
                       {/* Heatmap Cells */}
                       {["Open", "In Progress", "Resolved", "Closed"].map((status) => {
                         const data = priorityStatusData.find(d => d.priority === priority && d.status === status);
                         if (!data) return <div key={status} className="h-16 bg-slate-50 rounded"></div>;
                         
                                                   // Color intensity based on count - Green to Red gradient
                          const intensity = Math.min(data.count / 70, 1); // Normalize to 0-1
                          let red, green, blue;
                          
                          if (intensity <= 0.5) {
                            // Green to Yellow (0 to 0.5)
                            const factor = intensity * 2; // 0 to 1
                            red = Math.round(255 * factor);
                            green = 255;
                            blue = 0;
                          } else {
                            // Yellow to Red (0.5 to 1)
                            const factor = (intensity - 0.5) * 2; // 0 to 1
                            red = 255;
                            green = Math.round(255 * (1 - factor));
                            blue = 0;
                          }
                          
                          return (
                            <div
                              key={status}
                              className="h-16 rounded flex flex-col items-center justify-center text-white font-semibold text-sm cursor-pointer hover:scale-105 transition-transform group relative"
                              style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
                            >
                             <span className="text-lg">{data.count}</span>
                             <span className="text-xs opacity-90">issues</span>
                             
                             {/* Hover Tooltip */}
                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                               <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm whitespace-nowrap">
                                 <p className="font-semibold">{priority} Priority</p>
                                 <p className="text-xs text-slate-500">Status: {status}</p>
                                 <p className="text-xs text-slate-500">Count: {data.count} issues</p>
                                 <p className="text-xs text-slate-500">Intensity: {Math.round(intensity * 100)}%</p>
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   ))}
                 </div>
                 
                                   {/* Legend */}
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-600 rounded"></div>
                      <span className="text-sm text-slate-600">High Count (Red)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-slate-600">Medium Count (Yellow)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-sm text-slate-600">Low Count (Green)</span>
                    </div>
                  </div>
                 
                 {/* Summary Stats */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                   <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                     <div className="text-2xl font-bold text-red-600">
                       {priorityStatusData.filter(d => d.priority === "Critical" && d.status === "Open").reduce((sum, d) => sum + d.count, 0)}
                     </div>
                     <div className="text-sm text-red-700">Critical Open</div>
                   </div>
                   <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                     <div className="text-2xl font-bold text-orange-600">
                       {priorityStatusData.filter(d => d.priority === "High" && d.status === "Open").reduce((sum, d) => sum + d.count, 0)}
                     </div>
                     <div className="text-sm text-orange-700">High Open</div>
                   </div>
                   <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                     <div className="text-2xl font-bold text-yellow-600">
                       {priorityStatusData.filter(d => d.priority === "Medium" && d.status === "Open").reduce((sum, d) => sum + d.count, 0)}
                     </div>
                     <div className="text-sm text-yellow-700">Medium Open</div>
                   </div>
                   <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                     <div className="text-2xl font-bold text-green-600">
                       {priorityStatusData.filter(d => d.priority === "Low" && d.status === "Open").reduce((sum, d) => sum + d.count, 0)}
                     </div>
                     <div className="text-sm text-green-700">Low Open</div>
                   </div>
                 </div>
               </div>
             </Card>
           )}
         </div>
       </div>
     </div>
   )
 }
