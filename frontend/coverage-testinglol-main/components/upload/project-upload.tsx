'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Github, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  FolderUp,
  Link,
  Shield,
  Zap,
  Target,
  Globe
} from 'lucide-react';

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: any;
}

interface ProjectUploadProps {
  onUploadComplete?: (result: any) => void;
  onAnalysisStart?: (projectId: string) => void;
}

export function ProjectUpload({ onUploadComplete, onAnalysisStart }: ProjectUploadProps) {
  const [activeTab, setActiveTab] = useState('github');
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  // GitHub Repository Upload
  const [githubUrl, setGithubUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubToken, setGithubToken] = useState('');

  // File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle GitHub repository upload
  const handleGithubUpload = async () => {
    if (!githubUrl.trim()) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Please enter a valid GitHub repository URL'
      });
      return;
    }

    setUploadState({
      status: 'uploading',
      progress: 20,
      message: 'Connecting to GitHub repository...'
    });

    try {
      // Simulate progress updates
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, progress: 40, message: 'Downloading repository...' }));
      }, 1000);

      setTimeout(() => {
        setUploadState(prev => ({ ...prev, progress: 70, message: 'Analyzing project structure...' }));
      }, 2000);

      setTimeout(() => {
        setUploadState(prev => ({ ...prev, progress: 90, message: 'Preparing vulnerability scan...' }));
      }, 3000);

      // Use the API client
      const { api } = await import('@/lib/api');
      const result = await api.uploadGithubRepository({
        repository_url: githubUrl,
        branch: githubBranch,
        access_token: githubToken || undefined,
      });

      setUploadState({
        status: 'completed',
        progress: 100,
        message: 'Repository uploaded successfully!',
        result
      });

      onUploadComplete?.(result);
      onAnalysisStart?.(result.project_id);

    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: 'Please select a file to upload'
      });
      return;
    }

    setUploadState({
      status: 'uploading',
      progress: 10,
      message: 'Uploading file...'
    });

    try {
      // Use the API client
      const { api } = await import('@/lib/api');
      const result = await api.uploadProjectFile(selectedFile);

      setUploadState({
        status: 'processing',
        progress: 80,
        message: 'Extracting and analyzing files...'
      });

      // Simulate processing delay
      setTimeout(() => {
        setUploadState({
          status: 'completed',
          progress: 100,
          message: 'File uploaded and analyzed successfully!',
          result
        });

        onUploadComplete?.(result);
        onAnalysisStart?.(result.project_id);
      }, 2000);

    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setSelectedFile(file);
      } else {
        setUploadState({
          status: 'error',
          progress: 0,
          message: 'Please upload a ZIP file'
        });
      }
    }
  }, []);

  const resetUpload = () => {
    setUploadState({
      status: 'idle',
      progress: 0,
      message: ''
    });
    setSelectedFile(null);
    setGithubUrl('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Security Vulnerability Scanner</h2>
            <p className="text-sm text-gray-500">Powered by AI-driven analysis</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your application via GitHub repository or ZIP file to analyze vulnerabilities, 
          security risks, and get comprehensive analytics with ML-powered insights.
        </p>
      </div>

      {/* Upload Options */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-red-600" />
            <span>Choose Upload Method</span>
          </CardTitle>
          <CardDescription>
            Select how you'd like to upload your application for vulnerability analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="github" className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center space-x-2">
                <FolderUp className="w-4 h-4" />
                <span>ZIP File Upload</span>
              </TabsTrigger>
            </TabsList>

            {/* GitHub Repository Tab */}
            <TabsContent value="github" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="github-url" className="flex items-center space-x-2 mb-2">
                    <Github className="w-4 h-4" />
                    <span>Repository URL *</span>
                  </Label>
                  <Input
                    id="github-url"
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the full GitHub repository URL (public repositories work best)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github-branch">Branch</Label>
                    <Input
                      id="github-branch"
                      placeholder="main"
                      value={githubBranch}
                      onChange={(e) => setGithubBranch(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github-token">Access Token (Optional)</Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Public repositories</strong> can be scanned without a token. 
                    For <strong>private repositories</strong>, provide a GitHub personal access token with repository read permissions.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleGithubUpload}
                  disabled={uploadState.status === 'uploading' || uploadState.status === 'processing' || !githubUrl.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  size="lg"
                >
                  {uploadState.status === 'uploading' || uploadState.status === 'processing' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Start Vulnerability Scan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="file" className="space-y-4 mt-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-red-500 bg-red-50' 
                    : selectedFile 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <h3 className="text-lg font-medium text-green-800">File Selected</h3>
                    <p className="text-green-600">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedFile(null)}
                      className="mt-2"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Drop your ZIP file here, or click to browse
                    </h3>
                    <p className="text-gray-500">
                      Supports ZIP files up to 100MB
                    </p>
                    <Input
                      type="file"
                      accept=".zip"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              <Alert>
                <FolderUp className="h-4 w-4" />
                <AlertDescription>
                  Upload a ZIP file containing your application source code. 
                  We support most programming languages and frameworks.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleFileUpload}
                disabled={!selectedFile || uploadState.status === 'uploading' || uploadState.status === 'processing'}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                size="lg"
              >
                {uploadState.status === 'uploading' || uploadState.status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing File...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Start Vulnerability Scan
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadState.status !== 'idle' && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadState.status === 'completed' ? 'Analysis Complete' : 'Processing...'}
                </span>
                <span className="text-sm text-gray-500">{uploadState.progress}%</span>
              </div>
              
              <Progress value={uploadState.progress} className="w-full" />
              
              <div className="flex items-center space-x-2">
                {uploadState.status === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : uploadState.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                )}
                <span className="text-sm text-gray-600">{uploadState.message}</span>
              </div>

              {uploadState.status === 'error' && (
                <Button onClick={resetUpload} variant="outline" size="sm">
                  Try Again
                </Button>
              )}

              {uploadState.status === 'completed' && uploadState.result && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Upload Successful!</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Project ID:</span>
                      <Badge variant="secondary" className="ml-2">
                        {uploadState.result.project_id}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Files Analyzed:</span>
                      <span className="ml-2 font-medium">{uploadState.result.files_count || 'N/A'}</span>
                    </div>
                  </div>
                  <Button 
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => onAnalysisStart?.(uploadState.result.project_id)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    View Security Analysis
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>What You'll Get</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Vulnerability Detection</h4>
              <p className="text-sm text-gray-600">AI-powered security vulnerability scanning</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Risk Assessment</h4>
              <p className="text-sm text-gray-600">Comprehensive risk analysis and scoring</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Smart Analytics</h4>
              <p className="text-sm text-gray-600">ML-driven insights and recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectUpload;
