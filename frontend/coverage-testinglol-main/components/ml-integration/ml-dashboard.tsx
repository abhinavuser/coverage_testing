// ML Integration Dashboard Component
// Displays real-time data from your PKL models

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useComprehensiveAnalysis, 
  useRiskAreas, 
  useClusters, 
  useModelsInfo,
  useSelectedProject 
} from '@/hooks/use-coverage-data';
import { Brain, AlertTriangle, Target, BarChart3, Zap, Activity } from 'lucide-react';

export function MLDashboard() {
  const { selectedProjectId } = useSelectedProject();
  const { data: comprehensive, loading: compLoading, error: compError } = useComprehensiveAnalysis(selectedProjectId);
  const { data: riskAreas, loading: riskLoading } = useRiskAreas(selectedProjectId);
  const { data: clusters, loading: clustersLoading } = useClusters(selectedProjectId);
  const { data: modelsInfo, loading: modelsLoading } = useModelsInfo();

  if (compLoading || riskLoading || clustersLoading || modelsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 animate-spin" />
          <span>Loading ML Analysis...</span>
        </div>
      </div>
    );
  }

  if (compError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load ML data: {compError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">ML-Powered Coverage Analysis</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {modelsInfo?.model_info?.models_loaded?.length || 0} Models Active
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="risks">Risk Areas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Overall Coverage */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Coverage</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {comprehensive?.overall_functional_coverage_index || '0%'}
                </div>
                <Progress 
                  value={parseFloat(comprehensive?.overall_functional_coverage_index?.replace('%', '') || '0')} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            {/* High Risk Features */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskAreas?.high_risk_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {riskAreas?.total_risk_areas || 0} risk areas
                </p>
              </CardContent>
            </Card>

            {/* Active Clusters */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feature Clusters</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {clusters?.total_clusters || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {clusters?.total_features || 0} features analyzed
                </p>
              </CardContent>
            </Card>

            {/* ML Models Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ML Models</CardTitle>
                <Zap className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {modelsInfo?.models_available ? 'Active' : 'Inactive'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {modelsInfo?.model_info?.models_loaded?.join(', ') || 'No models'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance */}
          {comprehensive?.model_performance && (
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
                <CardDescription>
                  Accuracy scores from your trained PKL models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(comprehensive.model_performance).map(([model, data]) => (
                    <div key={model} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {model.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Accuracy: {(data.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={data.accuracy * 100} className="w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ML Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loaded ML Models</CardTitle>
              <CardDescription>
                Status of your PKL model files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {modelsInfo?.model_info?.models_loaded?.map((model) => (
                  <div key={model} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{model.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-muted-foreground">
                        {model === 'decision_tree' && 'Quick decision-based predictions'}
                        {model === 'random_forest' && 'Ensemble of decision trees'}
                        {model === 'xgboost' && 'Advanced gradient boosting'}
                        {model === 'kmeans' && 'Feature clustering algorithm'}
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                ))}
                
                {/* Preprocessing Components */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">STANDARD SCALER</h4>
                    <p className="text-sm text-muted-foreground">
                      Feature normalization
                    </p>
                  </div>
                  <Badge variant={modelsInfo?.model_info?.scaler_available ? "default" : "destructive"}>
                    {modelsInfo?.model_info?.scaler_available ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">LABEL ENCODER</h4>
                    <p className="text-sm text-muted-foreground">
                      Text to number conversion
                    </p>
                  </div>
                  <Badge variant={modelsInfo?.model_info?.label_encoder_available ? "default" : "destructive"}>
                    {modelsInfo?.model_info?.label_encoder_available ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clusters Tab */}
        <TabsContent value="clusters" className="space-y-4">
          {clusters?.clusters?.map((cluster) => (
            <Card key={cluster.cluster_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Cluster {cluster.cluster_id}</span>
                    <Badge variant={
                      cluster.characteristics.avg_risk_score >= 4 ? "destructive" :
                      cluster.characteristics.avg_risk_score >= 2 ? "default" : "secondary"
                    }>
                      {cluster.characteristics.avg_risk_score >= 4 ? 'High Risk' :
                       cluster.characteristics.avg_risk_score >= 2 ? 'Medium Risk' : 'Low Risk'}
                    </Badge>
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {cluster.feature_count} features
                  </span>
                </div>
                <CardDescription>{cluster.cluster_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-red-600">
                      {cluster.characteristics.avg_risk_score.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg Coverage</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {cluster.characteristics.avg_coverage.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uncovered</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {cluster.characteristics.uncovered_count}
                    </p>
                  </div>
                </div>
                
                {cluster.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {cluster.recommendations.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Risk Areas Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {riskAreas?.risk_areas?.slice(0, 10).map((risk, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{risk.feature_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Project: {risk.project_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        risk.risk_score >= 4 ? "destructive" : 
                        risk.risk_score >= 2 ? "default" : "secondary"
                      }>
                        Risk: {risk.risk_score}/5
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {risk.prediction_confidence}% confidence
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Priority</span>
                      <p className="text-sm font-medium">{risk.priority}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Impact</span>
                      <p className="text-sm font-medium">{risk.business_impact}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Coverage</span>
                      <p className="text-sm font-medium">{risk.coverage_percentage}%</p>
                    </div>
                  </div>

                  {risk.reasons.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Risk Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {risk.reasons.map((reason, reasonIdx) => (
                          <Badge key={reasonIdx} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MLDashboard;
