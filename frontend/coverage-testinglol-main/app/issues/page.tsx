"use client"

import { ArrowLeft, AlertTriangle, XCircle, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import BackgroundAnimation from "@/components/background-animation"

export default function IssuesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Testing Issues</h1>
                  <p className="text-slate-600 text-sm">Monitor and resolve testing errors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Issues Dashboard</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              This page will display all testing errors, warnings, and critical issues found during test execution.
              Currently blank as requested - ready for future implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
