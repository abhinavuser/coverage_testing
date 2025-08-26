"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Github, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: (projectData: any) => void
}

export function ProjectUploadModal({ isOpen, onClose, onProjectAdded }: ProjectUploadModalProps) {
  const [activeTab, setActiveTab] = useState("github")
  const [githubUrl, setGithubUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleGithubSubmit = async () => {
    if (!githubUrl.trim()) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      const mockProjectData = generateMockProjectData(githubUrl)
      onProjectAdded(mockProjectData)
      setIsProcessing(false)
      onClose()
    }, 3000)
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      const mockProjectData = generateMockProjectData(selectedFile.name)
      onProjectAdded(mockProjectData)
      setIsProcessing(false)
      onClose()
    }, 3000)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const generateMockProjectData = (source: string) => {
    const projectName = source.includes('github.com') 
      ? source.split('/').pop() || 'github-project'
      : source.replace('.zip', '')

    return {
      id: Date.now().toString(),
      name: projectName,
      source: source,
      coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
      tests: Math.floor(Math.random() * 500) + 100, // 100-600
      issues: Math.floor(Math.random() * 20) + 5, // 5-25
      success: Math.floor(Math.random() * 15) + 85, // 85-100%
      lastUpdated: new Date(),
      features: generateMockFeatures(),
      analytics: generateMockAnalytics(),
      recommendations: generateMockRecommendations()
    }
  }

  const generateMockFeatures = () => {
    const featureNames = [
      "Authentication", "Payment Processing", "User Management", 
      "Data Export", "Search Engine", "File Upload", "API Gateway",
      "Notification System", "Reporting Dashboard", "Admin Panel"
    ]
    
    return featureNames.slice(0, Math.floor(Math.random() * 6) + 4).map((name, index) => ({
      id: index.toString(),
      name,
      coverage: Math.floor(Math.random() * 40) + 60,
      riskLevel: Math.floor(Math.random() * 5) + 1,
      testCount: Math.floor(Math.random() * 30) + 10,
      status: Math.random() > 0.3 ? "good" : "warning"
    }))
  }

  const generateMockAnalytics = () => {
    return {
      monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        coverage: Math.floor(Math.random() * 30) + 70,
        tests: Math.floor(Math.random() * 100) + 50,
        issues: Math.floor(Math.random() * 15) + 2
      })),
      performance: {
        avgResponseTime: (Math.random() * 3 + 1).toFixed(1),
        maxResponseTime: (Math.random() * 8 + 3).toFixed(1),
        successRate: Math.floor(Math.random() * 15) + 85
      }
    }
  }

  const generateMockRecommendations = () => {
    const types = ["Performance", "Security", "Coverage", "Best Practice"]
    const priorities = ["low", "medium", "high", "critical"]
    
    return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
      id: i.toString(),
      title: `Improve ${types[Math.floor(Math.random() * types.length)]} for ${generateMockFeatures()[0]?.name || 'Feature'}`,
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      impactScore: Math.floor(Math.random() * 5) + 6,
      effort: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      roi: Math.floor(Math.random() * 40) + 60,
      status: "new"
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Add New Project</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload ZIP File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Repository URL</label>
                <Input
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Enter the full GitHub repository URL to analyze
                </p>
              </div>
              
              <Button 
                onClick={handleGithubSubmit} 
                disabled={!githubUrl.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Repository...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Analyze GitHub Repository
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Project ZIP File</label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive 
                      ? "border-blue-500 bg-blue-50" 
                      : selectedFile 
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-gray-50"
                  )}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="font-medium text-green-700">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-600">
                        Drag and drop your ZIP file here, or{" "}
                        <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                          browse
                          <Input
                            type="file"
                            accept=".zip"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500">
                        Maximum file size: 100 MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleFileUpload} 
                disabled={!selectedFile || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing ZIP File...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Analyze ZIP File
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {isProcessing && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-blue-700 font-medium">Processing your project...</p>
              <p className="text-sm text-blue-600">This may take a few moments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
