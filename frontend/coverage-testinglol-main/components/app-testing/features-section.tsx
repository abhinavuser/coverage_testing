"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  BarChart3,
  Bug,
  Clock,
  Code,
  Database,
  FileText,
  GitBranch,
  Monitor,
  Shield,
  Target,
  Zap,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live tracking of test execution and results",
      link: "#monitoring",
    },
    {
      icon: BarChart3,
      title: "Coverage Analytics",
      description: "Detailed code and functional coverage reports",
      link: "#analytics",
    },
    {
      icon: Bug,
      title: "Bug Detection",
      description: "Automated defect identification and classification",
      link: "#bugs",
    },
    {
      icon: Target,
      title: "Test Targeting",
      description: "Smart test case prioritization and execution",
      link: "#targeting",
    },
    {
      icon: Code,
      title: "Code Quality",
      description: "Static analysis and quality metrics tracking",
      link: "#quality",
    },
    {
      icon: Database,
      title: "Data Validation",
      description: "Comprehensive data integrity testing",
      link: "#data",
    },
    {
      icon: Monitor,
      title: "UI Testing",
      description: "Automated user interface and UX validation",
      link: "#ui",
    },
    {
      icon: GitBranch,
      title: "CI/CD Integration",
      description: "Seamless pipeline integration and automation",
      link: "#cicd",
    },
    {
      icon: FileText,
      title: "Test Documentation",
      description: "Automated test case generation and maintenance",
      link: "#docs",
    },
    {
      icon: Clock,
      title: "Performance Testing",
      description: "Load, stress, and performance benchmarking",
      link: "#performance",
    },
    {
      icon: Shield,
      title: "Security Testing",
      description: "Vulnerability scanning and security validation",
      link: "#security",
    },
    {
      icon: Zap,
      title: "API Testing",
      description: "Comprehensive API endpoint testing and validation",
      link: "#api",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4 animate-header-glow">
            Comprehensive Testing Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for complete functional app testing and quality assurance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-all duration-300 group animate-on-scroll"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
