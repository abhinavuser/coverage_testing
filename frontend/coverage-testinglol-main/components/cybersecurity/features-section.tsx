"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Eye,
  Zap,
  Users,
  Globe,
  Server,
  Smartphone,
  Cloud,
  Database,
  Wifi,
  AlertTriangle,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Threat Detection",
    description:
      "Advanced AI-powered threat detection systems that identify and neutralize cyber threats in real-time.",
    category: "Protection",
  },
  {
    icon: Lock,
    title: "Data Encryption",
    description: "Military-grade encryption protocols to secure your sensitive data and communications.",
    category: "Security",
  },
  {
    icon: Eye,
    title: "24/7 Monitoring",
    description: "Round-the-clock security monitoring with instant alerts and rapid response capabilities.",
    category: "Monitoring",
  },
  {
    icon: Zap,
    title: "Incident Response",
    description: "Rapid incident response team ready to contain and resolve security breaches immediately.",
    category: "Response",
  },
  {
    icon: Users,
    title: "Security Training",
    description: "Comprehensive cybersecurity training programs for your team and employees.",
    category: "Education",
  },
  {
    icon: Globe,
    title: "Network Security",
    description: "Complete network infrastructure protection against external and internal threats.",
    category: "Infrastructure",
  },
  {
    icon: Server,
    title: "Server Protection",
    description: "Enterprise-grade server security solutions with automated backup and recovery.",
    category: "Infrastructure",
  },
  {
    icon: Smartphone,
    title: "Mobile Security",
    description: "Comprehensive mobile device management and security for your workforce.",
    category: "Devices",
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    description: "Secure cloud migration and management with continuous compliance monitoring.",
    category: "Cloud",
  },
  {
    icon: Database,
    title: "Data Protection",
    description: "Advanced data loss prevention and backup solutions for critical business information.",
    category: "Data",
  },
  {
    icon: Wifi,
    title: "Wireless Security",
    description: "Secure wireless network implementation with enterprise-grade access controls.",
    category: "Network",
  },
  {
    icon: AlertTriangle,
    title: "Risk Assessment",
    description: "Comprehensive security audits and risk assessments to identify vulnerabilities.",
    category: "Assessment",
  },
]

export function FeaturesSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleFeatures((prev) => [...prev, featureIndex])
          }
        })
      },
      { threshold: 0.1 },
    )

    const featureCards = sectionRef.current?.querySelectorAll("[data-index]")
    featureCards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Comprehensive <span className="text-primary">Cybersecurity Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
            Protect your business with our full spectrum of cybersecurity services, from threat detection to incident
            response and everything in between.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleFeatures.includes(index)

            return (
              <div
                key={index}
                data-index={index}
                className={`scroll-reveal ${isVisible ? "revealed" : ""}`}
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <Card className="bg-card hover:bg-card/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-full group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs font-sans text-secondary font-semibold uppercase tracking-wide">
                        {feature.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold mb-3 text-card-foreground">{feature.title}</h3>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-serif font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  )
}
