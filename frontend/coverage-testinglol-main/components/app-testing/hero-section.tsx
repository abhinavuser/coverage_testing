"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, BarChart3, Shield, Zap, Upload } from "lucide-react"

export function HeroSection() {
  const [isScanning, setIsScanning] = useState(false)

  const handleScanClick = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 1000)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center animated-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-floating-particles" />
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-chart-2/10 rounded-full animate-floating-particles"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-chart-3/10 rounded-full animate-floating-particles"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Logo and brand */}
        <div className="flex items-center justify-center mb-8 scroll-reveal">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">TESTGUARD PRO</h1>
              <p className="text-sm text-muted-foreground">FUNCTIONAL APP TESTING</p>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold scroll-reveal relative">
            <span className="block mb-2">COMPREHENSIVE</span>
            <span className="text-primary block mb-2 animate-header-shimmer bg-clip-text">APP TESTING</span>
            <span className="block">ANALYTICS</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto scroll-reveal">
          ENSURE YOUR APP'S FUNCTIONALITY WITH COMPREHENSIVE TESTING ANALYTICS AND REAL-TIME COVERAGE INSIGHTS
        </p>

        {/* CTA Button with scan animation */}
        <Button
          onClick={() => {
            // Scroll to upload section
            const uploadSection = document.getElementById('upload-section');
            if (uploadSection) {
              uploadSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 scroll-reveal animate-pulse-glow`}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Application
        </Button>

        {/* Feature icons */}
        <div className="flex justify-center items-center space-x-12 mt-16 scroll-reveal">
          <div className="text-center animate-on-scroll">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-3 mx-auto hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Coverage</p>
          </div>
          <div className="text-center animate-on-scroll" style={{ animationDelay: "0.2s" }}>
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-3 mx-auto hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-chart-2" />
            </div>
            <p className="text-sm font-medium text-foreground">Analytics</p>
          </div>
          <div className="text-center animate-on-scroll" style={{ animationDelay: "0.4s" }}>
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-3 mx-auto hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-chart-3" />
            </div>
            <p className="text-sm font-medium text-foreground">Performance</p>
          </div>
        </div>
      </div>
    </section>
  )
}
