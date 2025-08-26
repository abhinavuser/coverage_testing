"use client"

import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-24 h-24 bg-primary/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-12 h-12 bg-secondary/10 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-12 h-12 text-primary animate-pulse-glow" />
                <Lock className="w-6 h-6 text-secondary absolute top-3 left-3" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">VAULT INFOSEC</h1>
                <p className="text-sm text-muted-foreground font-sans">YOUR SECURITY, OUR VOW</p>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-5xl md:text-6xl font-serif font-black text-foreground mb-6 leading-tight">
              YOUR SECURITY, <span className="text-primary">OUR VOW!</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed">
              DEFEND YOUR BUSINESS AGAINST THE LATEST CYBER THREATS WITH VAULT INFOSEC
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-serif font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Button>
          </div>

          {/* Floating Security Icons */}
          <div className="relative max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              <div className="flex flex-col items-center space-y-2 animate-float" style={{ animationDelay: "0s" }}>
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-sans text-muted-foreground">Protection</span>
              </div>
              <div className="flex flex-col items-center space-y-2 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-sans text-muted-foreground">Security</span>
              </div>
              <div className="flex flex-col items-center space-y-2 animate-float" style={{ animationDelay: "1s" }}>
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-sans text-muted-foreground">Monitoring</span>
              </div>
              <div className="flex flex-col items-center space-y-2 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-sans text-muted-foreground">Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
