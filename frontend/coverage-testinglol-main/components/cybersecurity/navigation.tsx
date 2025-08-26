"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X } from "lucide-react"

const navItems = [
  { name: "Home", href: "#home", active: true },
  { name: "Services", href: "#services" },
  { name: "Industries", href: "#industries" },
  { name: "Trainings", href: "#trainings" },
  { name: "About Us", href: "#about" },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-foreground">VAULT INFOSEC</span>
              <p className="text-xs text-muted-foreground font-sans">YOUR SECURITY, OUR VOW</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-sans text-sm transition-colors hover:text-primary ${
                  item.active ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-sans text-sm transition-colors hover:text-primary px-2 py-1 ${
                    item.active ? "text-primary font-semibold" : "text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
