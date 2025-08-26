"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Clock, TrendingUp, Target } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  type: "feature" | "test" | "insight" | "metric"
  description: string
  category: string
  relevance: number
  lastUpdated?: string
}

interface GlobalSearchProps {
  onFilterToggle: () => void
  hasActiveFilters: boolean
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Authentication Coverage",
    type: "feature",
    description: "User login, registration, and session management - 85% coverage",
    category: "Features",
    relevance: 95,
    lastUpdated: "2h ago",
  },
  {
    id: "2",
    title: "Payment Processing Tests",
    type: "test",
    description: "42 test cases covering credit card processing and transactions",
    category: "Test Cases",
    relevance: 88,
    lastUpdated: "1h ago",
  },
  {
    id: "3",
    title: "Critical Authentication Gap",
    type: "insight",
    description: "ML-detected missing edge case tests in authentication flow",
    category: "AI Insights",
    relevance: 92,
    lastUpdated: "2h ago",
  },
  {
    id: "4",
    title: "Overall Coverage Score",
    type: "metric",
    description: "Current overall test coverage at 78% with 5.2% increase",
    category: "Metrics",
    relevance: 85,
  },
]

export function GlobalSearch({ onFilterToggle, hasActiveFilters }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "authentication tests",
    "payment coverage",
    "critical gaps",
  ])

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filteredResults = mockSearchResults
          .filter(
            (result) =>
              result.title.toLowerCase().includes(query.toLowerCase()) ||
              result.description.toLowerCase().includes(query.toLowerCase()),
          )
          .sort((a, b) => b.relevance - a.relevance)
        setResults(filteredResults)
        setIsSearching(false)
        setShowResults(true)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setShowResults(false)
      setIsSearching(false)
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)])
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Target className="h-4 w-4 text-blue-500" />
      case "test":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "insight":
        return <Target className="h-4 w-4 text-purple-500" />
      case "metric":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-blue-500"
      case "test":
        return "bg-green-500"
      case "insight":
        return "bg-purple-500"
      case "metric":
        return "bg-orange-500"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features, tests, insights, or metrics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length <= 2 && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setQuery("")
                setShowResults(false)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="sm"
          onClick={onFilterToggle}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 text-xs">
              Active
            </Badge>
          )}
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {query.length <= 2 ? (
              // Recent searches and suggestions
              <div className="p-4 space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Recent Searches</div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-accent transition-colors"
                      onClick={() => handleSearch(search)}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : isSearching ? (
              <div className="p-4 text-center text-muted-foreground">Searching...</div>
            ) : results.length > 0 ? (
              <div className="p-2 space-y-1">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="flex items-start gap-3 w-full text-left p-3 rounded hover:bg-accent transition-colors"
                    onClick={() => {
                      handleSearch(query)
                      setShowResults(false)
                      // Handle navigation to result
                    }}
                  >
                    <div className="mt-0.5">{getTypeIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{result.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
                      {result.lastUpdated && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{result.lastUpdated}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{result.relevance}%</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
