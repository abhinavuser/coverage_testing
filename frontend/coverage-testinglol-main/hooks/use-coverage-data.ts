// React Hooks for Coverage Data Integration
// Custom hooks for backend API integration

import { useState, useEffect, useCallback } from 'react';
import { api, CoverageData, RiskPrediction, ClusterData, RecommendedArea, ApiError } from '@/lib/api';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `API Error: ${err.message}` 
        : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for overall coverage data
export function useOverallCoverage() {
  return useApiCall(() => api.getOverallCoverage());
}

// Hook for risk areas
export function useRiskAreas(projectId?: number) {
  return useApiCall(() => api.getRiskAreas(projectId), [projectId]);
}

// Hook for cluster data
export function useClusters(projectId?: number) {
  return useApiCall(() => api.getClusters(projectId), [projectId]);
}

// Hook for recommendations
export function useRecommendations(projectId?: number, limit: number = 10) {
  return useApiCall(() => api.getRecommendations(projectId, limit), [projectId, limit]);
}

// Hook for comprehensive analysis
export function useComprehensiveAnalysis(projectId?: number) {
  return useApiCall(() => api.getComprehensiveAnalysis(projectId), [projectId]);
}

// Hook for ML models info
export function useModelsInfo() {
  return useApiCall(() => api.getModelsInfo());
}

// Hook for projects
export function useProjects() {
  return useApiCall(() => api.getProjects());
}

// Hook for features
export function useFeatures(projectId: number) {
  return useApiCall(() => api.getFeatures(projectId), [projectId]);
}

// Hook for risk prediction (manual trigger)
export function useRiskPrediction() {
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictRisk = useCallback(async (
    featureData: {
      name: string;
      priority: string;
      complexity: string;
      business_impact: string;
      risk_score: number;
      status: string;
      coverage_percentage: number;
    },
    model: string = 'random_forest'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.predictRisk(featureData, model);
      setPrediction(result.prediction);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Risk prediction failed: ${err.message}` 
        : 'Risk prediction failed';
      setError(errorMessage);
      console.error('Risk prediction failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { prediction, loading, error, predictRisk };
}

// Hook for dashboard data (combines multiple API calls)
export function useDashboardData(projectId?: number) {
  const [dashboardData, setDashboardData] = useState<{
    coverage: any;
    risks: any;
    clusters: any;
    recommendations: any;
    models: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [coverage, risks, clusters, recommendations, models] = await Promise.all([
        api.getOverallCoverage(),
        api.getRiskAreas(projectId),
        api.getClusters(projectId),
        api.getRecommendations(projectId, 5),
        api.getModelsInfo(),
      ]);

      setDashboardData({
        coverage,
        risks,
        clusters,
        recommendations,
        models,
      });
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? `Dashboard data failed: ${err.message}` 
        : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
}

// Hook for real-time coverage monitoring
export function useRealTimeCoverage(projectId?: number, intervalMs: number = 30000) {
  const [coverage, setCoverage] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const data = await api.getOverallCoverage();
        setCoverage(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Real-time coverage update failed:', error);
      }
    };

    // Initial fetch
    fetchCoverage();

    // Set up interval
    const interval = setInterval(fetchCoverage, intervalMs);

    return () => clearInterval(interval);
  }, [projectId, intervalMs]);

  return { coverage, lastUpdated };
}

// Helper hook for managing selected project
export function useSelectedProject() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { data: projects } = useProjects();

  // Auto-select first project if available
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = projects?.find(p => p.id === selectedProjectId) || null;

  return {
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    projects: projects || [],
  };
}

// Hook for data transformations (for charts)
export function useChartData() {
  const { data: comprehensive } = useComprehensiveAnalysis();
  const { data: clusters } = useClusters();

  const chartData = {
    // Coverage distribution pie chart
    coverageDistribution: comprehensive ? [
      { name: 'Covered', value: comprehensive.summary.covered_features, fill: '#22c55e' },
      { name: 'Partial', value: comprehensive.summary.partial_features, fill: '#f59e0b' },
      { name: 'Uncovered', value: comprehensive.summary.uncovered_features, fill: '#ef4444' },
    ] : [],

    // Model performance comparison
    modelPerformance: comprehensive ? Object.entries(comprehensive.model_performance).map(([model, data]) => ({
      model: model.replace('_', ' '),
      accuracy: (data.accuracy * 100).toFixed(1),
      precision: ((data.classification_report.covered.precision + 
                   data.classification_report.partial.precision + 
                   data.classification_report.uncovered.precision) / 3 * 100).toFixed(1),
    })) : [],

    // Cluster distribution
    clusterDistribution: clusters ? Object.entries(clusters.cluster_distribution || {}).map(([cluster, count]) => ({
      cluster: cluster.replace('cluster_', 'Cluster '),
      count,
      fill: cluster === 'cluster_0' ? '#ef4444' : cluster === 'cluster_1' ? '#f59e0b' : '#22c55e'
    })) : [],

    // Risk levels distribution
    riskLevels: comprehensive?.recommended_testing_areas ? 
      comprehensive.recommended_testing_areas.reduce((acc, area) => {
        const level = area.risk_score >= 4 ? 'High' : area.risk_score >= 2 ? 'Medium' : 'Low';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) : {},
  };

  return chartData;
}

export default {
  useOverallCoverage,
  useRiskAreas,
  useClusters,
  useRecommendations,
  useComprehensiveAnalysis,
  useModelsInfo,
  useProjects,
  useFeatures,
  useRiskPrediction,
  useDashboardData,
  useRealTimeCoverage,
  useSelectedProject,
  useChartData,
};
