'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  FileText,
  BarChart3,
  TrendingUp,
  ExternalLink,
  Download,
  RefreshCw,
  Eye,
  Bug,
  Lock,
  Code,
  Activity
} from 'lucide-react';

interface VulnerabilityData {
  project_id: number;
  project_name: string;
  vulnerabilities_by_type: {
    [key: string]: Array<{
      id: number;
      file: string;
      severity: string;
      risk_score: number;
      status: string;
      priority: string;
    }>;
  };
  summary: {
    total_vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    overall_risk_score: number;
  };
  recommendations: string[];
}

export default function AnalysisPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [vulnerabilityData, setVulnerabilityData] = useState<VulnerabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchVulnerabilityData();
    }
  }, [projectId]);

  const fetchVulnerabilityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/vulnerabilities`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setVulnerabilityData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 4) return { level: 'Critical', color: 'text-red-600' };
    if (score >= 3) return { level: 'High', color: 'text-orange-500' };
    if (score >= 2) return { level: 'Medium', color: 'text-yellow-500' };
    return { level: 'Low', color: 'text-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-lg">Analyzing vulnerabilities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!vulnerabilityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No analysis data available</p>
      </div>
    );
  }

  const riskLevel = getRiskLevel(vulnerabilityData.summary.overall_risk_score);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Shield className="h-8 w-8 text-red-600" />
                <span>Security Analysis Report</span>
              </h1>
              <p className="text-gray-600 mt-2">{vulnerabilityData.project_name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={fetchVulnerabilityData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vulnerabilities</p>
                  <p className="text-2xl font-bold">{vulnerabilityData.summary.total_vulnerabilities}</p>
                </div>
                <Bug className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{vulnerabilityData.summary.critical}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High</p>
                  <p className="text-2xl font-bold text-orange-500">{vulnerabilityData.summary.high}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medium</p>
                  <p className="text-2xl font-bold text-yellow-500">{vulnerabilityData.summary.medium}</p>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Risk Score</p>
                  <p className={`text-2xl font-bold ${riskLevel.color}`}>
                    {vulnerabilityData.summary.overall_risk_score.toFixed(1)}
                  </p>
                  <p className={`text-xs ${riskLevel.color}`}>{riskLevel.level}</p>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vulnerabilities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vulnerabilities Tab */}
          <TabsContent value="vulnerabilities" className="space-y-6">
            {Object.entries(vulnerabilityData.vulnerabilities_by_type).map(([vulnType, vulnerabilities]) => (
              <Card key={vulnType}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-red-600" />
                      <span>{vulnType}</span>
                      <Badge variant="secondary">{vulnerabilities.length} issues</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vulnerabilities.slice(0, 5).map((vuln, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Code className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{vuln.file}</p>
                            <p className="text-sm text-gray-500">Risk Score: {vuln.risk_score}/5</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                          <Badge variant="outline">{vuln.priority}</Badge>
                        </div>
                      </div>
                    ))}
                    {vulnerabilities.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="link">
                          View {vulnerabilities.length - 5} more {vulnType} vulnerabilities
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Security Recommendations</span>
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations to improve your application security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilityData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{recommendation}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Shield className="h-6 w-6" />
                    <span>Fix Critical Issues</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-6 w-6" />
                    <span>Generate Action Plan</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Schedule Re-scan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vulnerability Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Vulnerability Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Critical</span>
                      <span className="text-sm text-gray-500">
                        {vulnerabilityData.summary.critical} issues
                      </span>
                    </div>
                    <Progress 
                      value={(vulnerabilityData.summary.critical / vulnerabilityData.summary.total_vulnerabilities) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">High</span>
                      <span className="text-sm text-gray-500">
                        {vulnerabilityData.summary.high} issues
                      </span>
                    </div>
                    <Progress 
                      value={(vulnerabilityData.summary.high / vulnerabilityData.summary.total_vulnerabilities) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Medium</span>
                      <span className="text-sm text-gray-500">
                        {vulnerabilityData.summary.medium} issues
                      </span>
                    </div>
                    <Progress 
                      value={(vulnerabilityData.summary.medium / vulnerabilityData.summary.total_vulnerabilities) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={riskLevel.level === 'Critical' ? '#dc2626' : 
                                 riskLevel.level === 'High' ? '#ea580c' : 
                                 riskLevel.level === 'Medium' ? '#ca8a04' : '#16a34a'}
                          strokeWidth="2"
                          strokeDasharray={`${(vulnerabilityData.summary.overall_risk_score / 5) * 100}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${riskLevel.color}`}>
                            {vulnerabilityData.summary.overall_risk_score.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500">out of 5.0</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${riskLevel.color}`}>
                        {riskLevel.level} Risk
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Based on vulnerability analysis
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Trends</CardTitle>
                <CardDescription>
                  Analysis of security issues across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(vulnerabilityData.vulnerabilities_by_type).map(([type, vulns]) => (
                    <div key={type} className="text-center p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{type}</h4>
                      <p className="text-2xl font-bold text-red-600">{vulns.length}</p>
                      <p className="text-xs text-gray-500">vulnerabilities</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
