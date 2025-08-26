"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Target, TrendingUp, Users } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: CheckCircle,
      title: "Automated Testing",
      description: "Comprehensive test automation for faster delivery",
    },
    {
      icon: Target,
      title: "Precision Coverage",
      description: "Detailed coverage analysis and gap identification",
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Real-time performance monitoring and optimization",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless integration with development workflows",
    },
  ]

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 animate-header-glow">
            TestGuard Pro will be the one stop solution for
            <br />
            functional app testing and quality assurance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-background border-border hover:shadow-lg transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
