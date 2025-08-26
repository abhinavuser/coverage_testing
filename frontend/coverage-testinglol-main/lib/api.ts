// API Configuration for Backend Integration
// Author: Coverage Testing Framework
// Backend: http://localhost:5000

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Response Types
export interface CoverageData {
  overall_functional_coverage_index: string;
  model_performance: {
    [key: string]: {
      accuracy: number;
      classification_report: {
        covered: { precision: number; recall: number; f1_score: number; support: number };
        partial: { precision: number; recall: number; f1_score: number; support: number };
        uncovered: { precision: number; recall: number; f1_score: number; support: number };
      };
    };
  };
  cluster_distribution: {
    [key: string]: number;
  };
  recommended_testing_areas: RecommendedArea[];
  summary: {
    total_features: number;
    covered_features: number;
    partial_features: number;
    uncovered_features: number;
  };
}

export interface RecommendedArea {
  name: string;
  module: string;
  priority: string;
  risk_score: number;
  complexity_score: number;
  status: string;
  business_impact: string;
  priority_num: number;
  impact_num: number;
  coverage_index: number;
  cluster: number;
}

export interface RiskPrediction {
  predicted_risk_level: string;
  confidence: number;
  raw_prediction: number;
  model_used: string;
  feature_importance: {
    [key: string]: number;
  };
}

export interface ClusterData {
  total_clusters: number;
  total_features: number;
  clustering_method: string;
  clusters: Array<{
    cluster_id: number;
    cluster_name: string;
    characteristics: {
      business_impact: string;
      status: string;
      avg_risk_score: number;
      avg_coverage: number;
      total_features: number;
      uncovered_count: number;
      high_risk_count: number;
    };
    features: Array<{
      name: string;
      priority: string;
      business_impact: string;
      risk_score: number;
      status: string;
      coverage_percentage: number;
    }>;
    feature_count: number;
    recommendations: string[];
  }>;
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0
    );
  }
}

// API Functions
export const api = {
  // Coverage Analysis
  async getOverallCoverage(): Promise<{
    overall_coverage: number;
    total_projects: number;
    active_projects: number;
    coverage_distribution: {
      excellent: number;
      good: number;
      needs_improvement: number;
    };
  }> {
    return apiRequest('/coverage/overall');
  },

  async getRiskAreas(projectId?: number): Promise<{
    total_risk_areas: number;
    high_risk_count: number;
    critical_impact_count: number;
    risk_areas: Array<{
      feature_id: string;
      feature_name: string;
      project_id: number;
      project_name: string;
      risk_score: number;
      business_impact: string;
      complexity: string;
      priority: string;
      status: string;
      coverage_percentage: number;
      risk_weight: number;
      prediction_confidence: number;
      reasons: string[];
    }>;
  }> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiRequest(`/coverage/risk-areas${query}`);
  },

  async getClusters(projectId?: number): Promise<ClusterData> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiRequest(`/coverage/clusters${query}`);
  },

  async getRecommendations(projectId?: number, limit: number = 10): Promise<{
    summary: {
      total_features_analyzed: number;
      uncovered_features: number;
      partial_coverage_features: number;
      high_priority_recommendations: number;
      critical_impact_features: number;
      average_coverage: number;
    };
    recommendations: RecommendedArea[];
    algorithm: string;
    total_recommendations: number;
  }> {
    const params = new URLSearchParams();
    if (projectId) params.append('project_id', projectId.toString());
    params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/coverage/recommendations${query}`);
  },

  // ML Model Integration
  async getModelsInfo(): Promise<{
    status: string;
    model_info: {
      models_loaded: string[];
      scaler_available: boolean;
      label_encoder_available: boolean;
      models_directory: string;
      [key: string]: any;
    };
    models_available: boolean;
  }> {
    return apiRequest('/ml/models/info');
  },

  async predictRisk(featureData: {
    name: string;
    priority: string;
    complexity: string;
    business_impact: string;
    risk_score: number;
    status: string;
    coverage_percentage: number;
  }, model: string = 'random_forest'): Promise<{
    status: string;
    prediction: RiskPrediction;
    feature_analyzed: {
      name: string;
      status: string;
      business_impact: string;
    };
  }> {
    return apiRequest('/ml/predict/risk', {
      method: 'POST',
      body: JSON.stringify({
        feature_data: featureData,
        model,
      }),
    });
  },

  async getComprehensiveAnalysis(projectId?: number): Promise<CoverageData> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiRequest(`/ml/comprehensive-analysis${query}`);
  },

  async getEnhancedRecommendations(projectId?: number, limit: number = 10): Promise<{
    status: string;
    recommendations: RecommendedArea[];
    total_features_analyzed: number;
    models_used: string[];
    ensemble_prediction: boolean;
    algorithm: string;
  }> {
    const params = new URLSearchParams();
    if (projectId) params.append('project_id', projectId.toString());
    params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/ml/recommend/enhanced${query}`);
  },

  // Project Management
  async getProjects(): Promise<Array<{
    id: number;
    name: string;
    description: string;
    created_at: string;
    feature_count: number;
    test_case_count: number;
  }>> {
    return apiRequest('/projects');
  },

  // Upload Endpoints
  async uploadGithubRepository(data: {
    repository_url: string;
    branch?: string;
    access_token?: string;
  }): Promise<{
    status: string;
    message: string;
    project_id: number;
    analysis: any;
    upload_method: string;
  }> {
    return apiRequest('/projects/upload/github', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async uploadProjectFile(file: File): Promise<{
    status: string;
    message: string;
    project_id: number;
    analysis: any;
    upload_method: string;
    files_count: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/projects/upload/file', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      },
    });
  },

  async getProjectVulnerabilities(projectId: number): Promise<{
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
  }> {
    return apiRequest(`/projects/${projectId}/vulnerabilities`);
  },

  async getProject(projectId: number): Promise<{
    id: number;
    name: string;
    description: string;
    weights: {
      functional: number;
      data: number;
      journey: number;
      risk: number;
      environmental: number;
    };
  }> {
    return apiRequest(`/projects/${projectId}`);
  },

  async getFeatures(projectId: number): Promise<Array<{
    id: number;
    feature_id: string;
    name: string;
    priority: string;
    complexity: string;
    business_impact: string;
    risk_score: number;
    status: string;
    coverage_percentage: number;
    test_cases: {
      total: number;
      passed: number;
      failed: number;
    };
  }>> {
    return apiRequest(`/projects/${projectId}/features`);
  },
};

// React Hook for API calls with loading states
export function useApi() {
  return {
    ...api,
    // Add any custom hooks here if needed
  };
}

export default api;
