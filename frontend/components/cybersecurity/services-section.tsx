"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Zap, Target } from "lucide-react"

const services = [
  {
    icon: Shield,
    title: "Customized Service",
    description: "Tailored cybersecurity solutions designed specifically for your business needs and infrastructure.",
    link: "/services/customized",
  },
  {
    icon: Target,
    title: "Stronger Security",
    description: "Advanced threat detection and prevention systems to protect against evolving cyber threats.",
    link: "/services/security",
  },
  {
    icon: Users,
    title: "Customer Delight",
    description: "Exceptional support and service delivery that exceeds expectations and builds lasting partnerships.",
    link: "/services/support",
  },
  {
    icon: Zap,
    title: "Start-up Spirit",
    description: "Agile, innovative approaches with the energy and flexibility of a modern cybersecurity startup.",
    link: "/services/innovation",
  },
]

export function ServicesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...prev, cardIndex])
          }
        })
      },
      { threshold: 0.2 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
            Vault Infosec will be the one stop shop for{" "}
            <span className="block">cybersecurity related products and services.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon
            const isVisible = visibleCards.includes(index)

            return (
              <div
                key={index}
                data-index={index}
                className={`scroll-reveal ${isVisible ? "revealed" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Card className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3">{service.title}</h3>
                    <p className="text-sm font-sans text-background/80 mb-4 leading-relaxed">{service.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-background text-background hover:bg-background hover:text-foreground transition-colors bg-transparent"
                      onClick={() => (window.location.href = service.link)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
