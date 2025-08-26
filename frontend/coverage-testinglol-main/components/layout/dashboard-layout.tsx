"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { FeaturesPage } from "@/components/features/features-page"
import { AIInsightsPage } from "@/components/ai-insights/ai-insights-page"
import { SettingsPage } from "@/components/settings/settings-page"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)

    // Observe all icons and animated elements
    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [activeTab])

  const renderTabContent = () => {
    switch (activeTab) {
      case "features":
        return <FeaturesPage />
      case "ai-insights":
        return <AIInsightsPage />
      case "settings":
        return <SettingsPage />
      case "overview":
      default:
        return children
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="p-6">{renderTabContent()}</main>
    </div>
  )
}
