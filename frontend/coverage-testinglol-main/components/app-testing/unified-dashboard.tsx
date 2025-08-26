"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SettingsModal } from "@/components/settings/settings-modal"
import BackgroundAnimation from "@/components/background-animation"
import ProjectUpload from "@/components/upload/project-upload"
import Link from "next/link"

import {
  Play,
  Upload,
  Shield,
  Target,
  TrendingUp,
  Zap,
  CheckCircle,
  Activity,
  BarChart3,
  Search,
  Filter,
  Download,
  MapPin,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  FileText,
} from "lucide-react"

export function UnifiedTestingDashboard() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanRotation, setScanRotation] = useState(0)
  const [scanCompleted, setScanCompleted] = useState(false)
  const [visibleElements, setVisibleElements] = useState(new Set())
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  
  // Simple data storage
  const [dashboardData, setDashboardData] = useState({
    coverage: 87,
    issues: 23,
    tests: 1247,
    success: 94.2,
    scanCount: 0,
    lastScanDate: null as Date | null
  })

  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleScanClick = () => {
    setIsScanning(true)
    setScanRotation((prev) => prev + 360)
    
    // Simulate data collection during scan
    setTimeout(() => {
      // Generate new random scan data
      const newData = {
        coverage: Math.max(70, Math.min(98, dashboardData.coverage + Math.floor(Math.random() * 10) - 5)),
        issues: Math.max(5, Math.min(50, dashboardData.issues + Math.floor(Math.random() * 10) - 5)),
        tests: Math.max(800, Math.min(2000, dashboardData.tests + Math.floor(Math.random() * 200) - 100)),
        success: Math.max(88, Math.min(99, dashboardData.success + Math.floor(Math.random() * 6) - 3)),
        scanCount: dashboardData.scanCount + 1,
        lastScanDate: new Date()
      }
      
      setDashboardData(newData)
      setIsScanning(false)
      setScanCompleted(true)
    }, 2000)
  }

  const handleCardHover = (cardId: string) => {
    setExpandedCard(cardId)
  }

  const handleCardLeave = () => {
    setExpandedCard(null)
  }

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => {
      if (el.id) {
        observerRef.current?.observe(el)
      }
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">TestGuard Pro</span>
          </div>

          <div className="flex items-center space-x-8 mx-auto">
            <Link href="/analytics" className="text-slate-600 hover:text-red-600 transition-colors font-medium">Analytics</Link>
            <Link href="/statistics" className="text-slate-600 hover:text-red-600 transition-colors font-medium">Statistics</Link>
            <Link href="/reports" className="text-slate-600 hover:text-red-600 transition-colors font-medium">Reports</Link>
          </div>

          <div className="flex items-center">
            <SettingsModal />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        {/* Hero Section */}
        <div id="dashboard" className="max-w-7xl mx-auto px-8 text-center mb-32" data-animate>
          <div className={`mb-16 transition-all duration-1000 ${visibleElements.has("dashboard") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Badge variant="secondary" className="mb-8 bg-red-100 text-red-700 hover:bg-red-200 text-lg px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Next-Generation Testing Platform
            </Badge>
            {scanCompleted && (
              <div className="mb-6 text-center">
                <p className="text-slate-600 text-lg">
                  Scan #{dashboardData.scanCount} completed • Last scan: {dashboardData.lastScanDate?.toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="relative mb-12">
              <h1 className="text-7xl md:text-8xl font-black text-slate-800 mb-8 leading-tight tracking-wider font-sans">
                <span className="block bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent animate-fade-in">
                  Smart
                </span>
                <span className="block bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent animate-pulse animate-bounce">
                  Testing
                </span>
                <span className="block bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-clip-text text-transparent animate-fade-in">
                  Analytics
                </span>
              </h1>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-30 animate-bounce"></div>
            </div>

            <p className="text-3xl text-slate-600 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
              Transform your testing workflow with AI-powered insights, comprehensive coverage analysis, and real-time
              performance monitoring. Built for modern development teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-2xl transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl font-bold rounded-xl"
                onClick={() => {
                  // Scroll to upload section
                  const uploadSection = document.getElementById('upload-section');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Upload className="w-8 h-8 mr-4" />
                Upload Application
              </Button>

              <a
                href="/reports"
                className="px-8 py-4 text-lg bg-transparent border-2 hover:bg-slate-50 inline-flex items-center justify-center rounded-xl border-slate-300 text-slate-700 hover:border-red-300 hover:text-red-600 transition-all duration-500 font-bold shadow-xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div id="stats" className="max-w-7xl mx-auto px-8 mb-24" data-animate>
          <div className={`transition-all duration-1000 delay-200 ${visibleElements.has("stats") ? "opacity-100 translate-y-0 scale-100 animate-swish-left" : "opacity-0 translate-y-20 scale-95"}`}>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-800 mb-6">Test Coverage Overview</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real-time metrics and insights from your testing infrastructure. Monitor coverage, track issues, and optimize performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Coverage Card */}
              <div className="relative">
                <Card 
                  className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                  onMouseEnter={() => handleCardHover("coverage")}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-lg px-3 py-1">
                      {scanCompleted ? "+12%" : "---"}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {scanCompleted ? `${dashboardData.coverage}%` : "---"}
                  </h3>
                  <p className="text-slate-600 text-lg">Test Coverage</p>
                  
                  {/* Expanded Content - Historical Data */}
                  {expandedCard === "coverage" && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 z-50">
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Unit Tests:</span>
                          <span className="font-semibold text-blue-600">
                            {scanCompleted ? `${Math.floor(dashboardData.coverage * 1.1)}%` : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Integration:</span>
                          <span className="font-semibold text-green-600">
                            {scanCompleted ? `${Math.floor(dashboardData.coverage * 0.9)}%` : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>E2E Tests:</span>
                          <span className="font-semibold text-purple-600">
                            {scanCompleted ? `${Math.floor(dashboardData.coverage * 0.8)}%` : "---"}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Trend:</span>
                            <span className="text-green-600">
                              {scanCompleted ? "+2.3% this week" : "---"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Target:</span>
                            <span>95%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Issues Card */}
              <div className="relative">
                <Card 
                  className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                  onMouseEnter={() => handleCardHover("issues")}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-red-600" />
                    </div>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 text-lg px-3 py-1">
                      {scanCompleted ? "-8%" : "---"}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {scanCompleted ? dashboardData.issues : "---"}
                  </h3>
                  <p className="text-slate-600 text-lg">Active Issues</p>
                  
                  {/* Expanded Content - Historical Data */}
                  {expandedCard === "issues" && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 z-50">
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Critical Priority:</span>
                          <span className="font-semibold text-red-600">
                            {scanCompleted ? "3" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>High Priority:</span>
                          <span className="font-semibold text-orange-600">
                            {scanCompleted ? "8" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medium Priority:</span>
                          <span className="font-semibold text-yellow-600">
                            {scanCompleted ? "8" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Priority:</span>
                          <span className="font-semibold text-green-600">
                            {scanCompleted ? "4" : "---"}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Resolved Today:</span>
                            <span className="text-green-600">
                              {scanCompleted ? "5" : "---"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Avg Resolution:</span>
                            <span>
                              {scanCompleted ? "2.3 days" : "---"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Tests Executed Card */}
              <div className="relative">
                <Card 
                  className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                  onMouseEnter={() => handleCardHover("tests")}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-8 h-8 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-lg px-3 py-1">
                      {scanCompleted ? "+5%" : "---"}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {scanCompleted ? dashboardData.tests.toLocaleString() : "---"}
                  </h3>
                  <p className="text-slate-600 text-lg">Tests Executed</p>
                  
                  {/* Expanded Content - Historical Data */}
                  {expandedCard === "tests" && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 z-50">
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Today:</span>
                          <span className="font-semibold text-blue-600">
                            {scanCompleted ? "187 tests" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>This Week:</span>
                          <span className="font-semibold text-purple-600">
                            {scanCompleted ? "873 tests" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>This Month:</span>
                          <span className="font-semibold text-green-600">
                            {scanCompleted ? "3,492 tests" : "---"}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Avg Duration:</span>
                            <span>
                              {scanCompleted ? "2.1s" : "---"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Success Rate:</span>
                            <span className="text-green-600">
                              {scanCompleted ? `${dashboardData.success}%` : "---"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Success Rate Card */}
              <div className="relative">
                <Card 
                  className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                  onMouseEnter={() => handleCardHover("success")}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-lg px-3 py-1">
                      {scanCompleted ? "+18%" : "---"}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">
                    {scanCompleted ? `${dashboardData.success}%` : "---"}
                  </h3>
                  <p className="text-slate-600 text-lg">Success Rate</p>
                  
                  {/* Expanded Content - Historical Data */}
                  {expandedCard === "success" && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 z-50">
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Passed:</span>
                          <span className="font-semibold text-green-600">
                            {scanCompleted ? "1,173" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Failed:</span>
                          <span className="font-semibold text-red-600">
                            {scanCompleted ? "60" : "---"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skipped:</span>
                          <span className="font-semibold text-yellow-600">
                            {scanCompleted ? "14" : "---"}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Trend:</span>
                            <span className="text-green-600">
                              {scanCompleted ? "+1.2% this week" : "---"}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Last Failure:</span>
                            <span>
                              {scanCompleted ? "3 days ago" : "---"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="max-w-7xl mx-auto px-8 mb-24 mt-64" data-animate>
          <div className={`transition-all duration-1000 delay-400 ${visibleElements.has("about") ? "opacity-100 translate-y-0 scale-100 animate-diagonal-swish" : "opacity-0 translate-y-20 scale-95"}`}>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-800 mb-6">About TestGuard Pro</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                TestGuard Pro is an end-to-end testing analytics platform that brings coverage, stability, and
                speed insights into a single, elegant dashboard. Built with modern tooling for teams that care
                about quality and developer experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h3 className="text-2xl font-bold text-slate-800">Why TestGuard Pro</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Ship with confidence. Detect risk early with intelligent coverage views, risk clustering, and
                  actionable insights tailored for fast-moving teams.
                </p>
              </Card>

              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-slate-800">How It Works</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  We aggregate your test results, map priority to status, and surface trends over time with
                  interactive charts so you can focus on improvements that matter.
                </p>
              </Card>

              <Card className="p-8 bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-800">What You Get</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Unified analytics, detailed statistics, exportable reports, and a fast responsive UI
                  that fits seamlessly into your workflow.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div id="upload-section" className="py-32 bg-gradient-to-br from-slate-50 to-slate-100" data-animate>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Upload Your Application
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get instant vulnerability analysis and security insights for your application. 
              Upload via GitHub repository or ZIP file to start scanning.
            </p>
          </div>
          
          <ProjectUpload 
            onUploadComplete={(result) => {
              console.log('Upload completed:', result);
              // Handle upload completion
            }}
            onAnalysisStart={(projectId) => {
              console.log('Analysis started for project:', projectId);
              // Navigate to analysis results
              window.location.href = `/analysis/${projectId}`;
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/30 to-blue-800/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div 
            className={`grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 transition-all duration-1000 delay-500 ${visibleElements.has("footer") ? "opacity-100 translate-y-0 scale-100 animate-flip-swish" : "opacity-0 translate-y-20 scale-95"}`}
          >
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">TestGuard Pro</span>
              </div>
              <p className="text-slate-200 leading-relaxed mb-6">
                The most comprehensive testing platform for modern development teams. Ensure quality, security, and
                performance with AI-powered insights and real-time monitoring.
              </p>
              <div className="flex space-x-4 mb-6">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <Github className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                  <Linkedin className="w-5 h-5" />
                </div>
              </div>
              
              {/* Platform Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">2.4M+</div>
                  <div className="text-sm text-slate-300">Tests Executed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">98.7%</div>
                  <div className="text-sm text-slate-300">Avg Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">15.2K</div>
                  <div className="text-sm text-slate-300">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">2.1s</div>
                  <div className="text-sm text-slate-300">Avg Test Time</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TestGuard Pro. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
