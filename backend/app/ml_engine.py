"""
Advanced ML-powered recommendation engine for coverage optimization
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from typing import List, Dict, Any
import pandas as pd

class MLRecommendationEngine:
    """
    Machine Learning engine for intelligent test coverage recommendations
    """
    
    @staticmethod
    def generate_ai_recommendations(features_data: List[Dict]) -> List[Dict]:
        """
        Generate ML-powered recommendations based on feature analysis
        """
        if not features_data:
            return []
            
        try:
            # Prepare feature matrix
            feature_matrix = MLRecommendationEngine._prepare_feature_matrix(features_data)
            
            # Cluster analysis for pattern detection
            clusters = MLRecommendationEngine._perform_clustering(feature_matrix)
            
            # Risk-based prioritization
            risk_scores = MLRecommendationEngine._calculate_risk_scores(features_data, clusters)
            
            # Generate recommendations
            recommendations = MLRecommendationEngine._generate_recommendations(
                features_data, clusters, risk_scores
            )
            
            return sorted(recommendations, key=lambda x: x['impact_score'], reverse=True)
            
        except Exception as e:
            # Fallback to simple heuristic recommendations
            return MLRecommendationEngine._fallback_recommendations(features_data)
    
    @staticmethod
    def _prepare_feature_matrix(features_data: List[Dict]) -> np.ndarray:
        """Prepare numerical feature matrix for ML algorithms"""
        feature_matrix = []
        
        for feature in features_data:
            # Convert categorical to numerical
            priority_score = {'high': 3, 'medium': 2, 'low': 1}.get(feature.get('priority', 'medium'), 2)
            coverage_score = {'covered': 3, 'partial': 2, 'uncovered': 1}.get(feature.get('status', 'uncovered'), 1)
            complexity_score = {'high': 3, 'medium': 2, 'low': 1}.get(feature.get('complexity', 'medium'), 2)
            impact_score = {'critical': 5, 'high': 4, 'medium': 3, 'low': 2}.get(feature.get('business_impact', 'medium'), 3)
            
            risk_score = feature.get('risk_score', 1)
            
            # Feature vector: [priority, coverage, complexity, impact, risk]
            feature_vector = [priority_score, coverage_score, complexity_score, impact_score, risk_score]
            feature_matrix.append(feature_vector)
        
        return np.array(feature_matrix)
    
    @staticmethod
    def _perform_clustering(feature_matrix: np.ndarray) -> np.ndarray:
        """Perform clustering to identify similar features"""
        if len(feature_matrix) < 3:
            return np.zeros(len(feature_matrix))
            
        # Normalize features
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(feature_matrix)
        
        # K-means clustering
        n_clusters = min(3, len(feature_matrix))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(scaled_features)
        
        return clusters
    
    @staticmethod
    def _calculate_risk_scores(features_data: List[Dict], clusters: np.ndarray) -> List[float]:
        """Calculate ML-enhanced risk scores"""
        risk_scores = []
        
        for i, feature in enumerate(features_data):
            base_risk = feature.get('risk_score', 1)
            
            # Business impact multiplier
            impact_multiplier = {
                'critical': 2.0, 'high': 1.5, 'medium': 1.0, 'low': 0.5
            }.get(feature.get('business_impact', 'medium'), 1.0)
            
            # Coverage penalty
            coverage_penalty = {
                'uncovered': 2.0, 'partial': 1.3, 'covered': 0.5
            }.get(feature.get('status', 'uncovered'), 1.0)
            
            # Complexity factor
            complexity_factor = {
                'high': 1.4, 'medium': 1.0, 'low': 0.8
            }.get(feature.get('complexity', 'medium'), 1.0)
            
            # Cluster-based adjustment (similar features should have similar priorities)
            cluster_adjustment = 1.0
            if len(clusters) > i:
                # Features in cluster 0 (typically high-risk) get higher scores
                cluster_adjustment = 1.2 if clusters[i] == 0 else 1.0
            
            # Final risk score calculation
            final_risk = base_risk * impact_multiplier * coverage_penalty * complexity_factor * cluster_adjustment
            risk_scores.append(min(final_risk, 10.0))  # Cap at 10
        
        return risk_scores
    
    @staticmethod
    def _generate_recommendations(features_data: List[Dict], clusters: np.ndarray, 
                                risk_scores: List[float]) -> List[Dict]:
        """Generate specific recommendations based on ML analysis"""
        recommendations = []
        
        for i, feature in enumerate(features_data):
            risk_score = risk_scores[i] if i < len(risk_scores) else 1.0
            
            # Only recommend for high-risk or uncovered features
            if risk_score >= 3.0 or feature.get('status') == 'uncovered':
                
                # Determine recommendation type based on feature characteristics
                rec_type = MLRecommendationEngine._determine_recommendation_type(feature)
                
                # Generate specific recommendation
                recommendation = {
                    'priority': MLRecommendationEngine._calculate_priority(risk_score),
                    'type': rec_type,
                    'feature': feature.get('name', 'Unknown Feature'),
                    'feature_id': feature.get('id'),
                    'reason': MLRecommendationEngine._generate_reason(feature, risk_score),
                    'impact_score': round(risk_score * 10, 1),
                    'effort_estimate': MLRecommendationEngine._estimate_effort(feature),
                    'business_justification': MLRecommendationEngine._generate_business_justification(feature),
                    'risk_mitigation': MLRecommendationEngine._generate_risk_mitigation(feature),
                    'cluster': int(clusters[i]) if i < len(clusters) else 0
                }
                
                recommendations.append(recommendation)
        
        return recommendations
    
    @staticmethod
    def _determine_recommendation_type(feature: Dict) -> str:
        """Determine the type of recommendation needed"""
        status = feature.get('status', 'uncovered')
        complexity = feature.get('complexity', 'medium')
        business_impact = feature.get('business_impact', 'medium')
        
        if status == 'uncovered':
            if business_impact in ['critical', 'high']:
                return 'critical_feature_gap'
            else:
                return 'feature_gap'
        elif status == 'partial':
            return 'partial_coverage_improvement'
        elif complexity == 'high':
            return 'integration_testing'
        else:
            return 'coverage_enhancement'
    
    @staticmethod
    def _calculate_priority(risk_score: float) -> int:
        """Calculate priority level (1-5, where 1 is highest)"""
        if risk_score >= 7.0:
            return 1  # Critical
        elif risk_score >= 5.0:
            return 2  # High
        elif risk_score >= 3.0:
            return 3  # Medium
        elif risk_score >= 2.0:
            return 4  # Low
        else:
            return 5  # Minimal
    
    @staticmethod
    def _generate_reason(feature: Dict, risk_score: float) -> str:
        """Generate human-readable reason for recommendation"""
        name = feature.get('name', 'Feature')
        status = feature.get('status', 'uncovered')
        business_impact = feature.get('business_impact', 'medium')
        
        if risk_score >= 7.0:
            return f"Critical: {name} has {business_impact} business impact and {status} coverage"
        elif risk_score >= 5.0:
            return f"High-risk: {name} requires immediate attention due to {status} status"
        elif status == 'uncovered':
            return f"Missing coverage: {name} has no test coverage"
        elif status == 'partial':
            return f"Incomplete testing: {name} needs additional test cases"
        else:
            return f"Enhancement opportunity: {name} could benefit from improved testing"
    
    @staticmethod
    def _estimate_effort(feature: Dict) -> str:
        """Estimate effort required"""
        complexity = feature.get('complexity', 'medium')
        status = feature.get('status', 'uncovered')
        
        if status == 'uncovered':
            if complexity == 'high':
                return 'weeks'
            elif complexity == 'medium':
                return 'days'
            else:
                return 'hours'
        elif status == 'partial':
            return 'days' if complexity == 'high' else 'hours'
        else:
            return 'hours'
    
    @staticmethod
    def _generate_business_justification(feature: Dict) -> str:
        """Generate business justification"""
        name = feature.get('name', 'Feature')
        business_impact = feature.get('business_impact', 'medium')
        
        justifications = {
            'critical': f"Testing {name} is essential for business continuity and user satisfaction",
            'high': f"Adequate testing of {name} significantly reduces business risk",
            'medium': f"Testing {name} improves overall system reliability",
            'low': f"Testing {name} provides additional quality assurance"
        }
        
        return justifications.get(business_impact, justifications['medium'])
    
    @staticmethod
    def _generate_risk_mitigation(feature: Dict) -> str:
        """Generate risk mitigation statement"""
        status = feature.get('status', 'uncovered')
        
        mitigations = {
            'uncovered': "Prevents production failures and user-impacting bugs",
            'partial': "Reduces risk of edge cases and integration issues",
            'covered': "Maintains high quality standards and prevents regression"
        }
        
        return mitigations.get(status, mitigations['uncovered'])
    
    @staticmethod
    def _fallback_recommendations(features_data: List[Dict]) -> List[Dict]:
        """Simple fallback recommendations when ML fails"""
        recommendations = []
        
        for feature in features_data:
            if feature.get('status') == 'uncovered' and feature.get('business_impact') in ['critical', 'high']:
                recommendations.append({
                    'priority': 1,
                    'type': 'critical_feature_gap',
                    'feature': feature.get('name', 'Unknown'),
                    'reason': 'Critical feature without test coverage',
                    'impact_score': 80.0,
                    'effort_estimate': 'days',
                    'business_justification': 'Critical for business operations',
                    'risk_mitigation': 'Prevents critical system failures'
                })
        
        return recommendations

# Legacy function for backward compatibility
def generate_ai_recommendations(features_data):
    """Legacy function - redirects to new ML engine"""
    return MLRecommendationEngine.generate_ai_recommendations(features_data)