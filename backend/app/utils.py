"""
Utility functions for 5-Dimensional Coverage Framework
Implements mathematical models and calculations as per specification
"""

import math
from typing import Dict, List, Tuple, Any
from datetime import datetime, timedelta
import numpy as np
from .models import (
    Project, Feature, TestCase, UserJourney, Environment, 
    DataCoverageScenario, CoverageReport, RecommendationEngine
)

class CoverageCalculator:
    """
    Core calculator implementing the mathematical model:
    Total Coverage Score = Σ(Wi × Ci × Ri)
    """
    
    @staticmethod
    def calculate_functional_coverage(project_id: int) -> float:
        """
        Calculate Functional Coverage (CF)
        CF = (Tested_Features / Total_Features) × 100
        """
        from .models import Feature, db
        
        features = Feature.query.filter_by(project_id=project_id).all()
        if not features:
            return 0.0
            
        total_features = len(features)
        tested_features = sum(1 for f in features if f.status in ['covered', 'partial'])
        
        return round((tested_features / total_features) * 100, 2)
    
    @staticmethod
    def calculate_data_coverage(project_id: int) -> float:
        """
        Calculate Data Coverage (CD)
        CD = (Σ(Boundary_Tests + Equivalence_Tests + Error_Tests) / Total_Data_Scenarios) × 100
        """
        from .models import DataCoverageScenario, db
        
        scenarios = DataCoverageScenario.query.filter_by(project_id=project_id).all()
        if not scenarios:
            return 0.0
            
        total_scenarios = sum(s.total_scenarios for s in scenarios)
        if total_scenarios == 0:
            return 0.0
            
        covered_scenarios = sum(
            s.boundary_tests + s.equivalence_tests + s.error_tests 
            for s in scenarios
        )
        
        return round((covered_scenarios / total_scenarios) * 100, 2)
    
    @staticmethod
    def calculate_journey_coverage(project_id: int) -> float:
        """
        Calculate User Journey Coverage (CJ)
        CJ = (Critical_Paths_Tested / Total_Critical_Paths) × 100
        """
        from .models import UserJourney, db
        
        journeys = UserJourney.query.filter_by(project_id=project_id).all()
        if not journeys:
            return 0.0
            
        critical_journeys = [j for j in journeys if j.business_impact in ['critical', 'high']]
        if not critical_journeys:
            return 100.0  # No critical paths defined
            
        tested_critical = sum(
            1 for j in critical_journeys 
            if j.test_status == 'passed'
        )
        
        return round((tested_critical / len(critical_journeys)) * 100, 2)
    
    @staticmethod
    def calculate_risk_coverage(project_id: int) -> float:
        """
        Calculate Risk Coverage (CR)
        CR = Σ(Business_Impact × Test_Completeness) / Total_Risk_Scenarios
        """
        from .models import Feature, db
        
        features = Feature.query.filter_by(project_id=project_id).all()
        if not features:
            return 0.0
            
        total_risk_score = 0
        covered_risk_score = 0
        
        impact_weights = {'critical': 5, 'high': 4, 'medium': 3, 'low': 2}
        
        for feature in features:
            business_weight = impact_weights.get(feature.business_impact, 2)
            risk_contribution = business_weight * feature.risk_score
            total_risk_score += risk_contribution
            
            if feature.status == 'covered':
                test_completeness = 1.0
            elif feature.status == 'partial':
                test_completeness = 0.5
            else:
                test_completeness = 0.0
                
            covered_risk_score += risk_contribution * test_completeness
        
        if total_risk_score == 0:
            return 0.0
            
        return round((covered_risk_score / total_risk_score) * 100, 2)
    
    @staticmethod
    def calculate_environmental_coverage(project_id: int) -> float:
        """
        Calculate Environmental Coverage (CE)
        CE = (Tested_Environments / Required_Environments) × 100
        """
        from .models import Environment, db
        
        environments = Environment.query.filter_by(
            project_id=project_id, 
            is_required=True
        ).all()
        
        if not environments:
            return 100.0  # No required environments
            
        tested_environments = sum(1 for env in environments if env.is_tested)
        
        return round((tested_environments / len(environments)) * 100, 2)
    
    @staticmethod
    def calculate_total_coverage_score(project_id: int) -> Dict[str, float]:
        """
        Calculate the comprehensive coverage score using all dimensions
        """
        from .models import Project, db
        
        project = Project.query.get(project_id)
        if not project:
            return {}
            
        # Calculate individual dimension scores
        cf = CoverageCalculator.calculate_functional_coverage(project_id)
        cd = CoverageCalculator.calculate_data_coverage(project_id)
        cj = CoverageCalculator.calculate_journey_coverage(project_id)
        cr = CoverageCalculator.calculate_risk_coverage(project_id)
        ce = CoverageCalculator.calculate_environmental_coverage(project_id)
        
        # Apply weights and calculate total score
        total_score = (
            project.functional_weight * cf +
            project.data_weight * cd +
            project.journey_weight * cj +
            project.risk_weight * cr +
            project.environmental_weight * ce
        )
        
        # Calculate risk-adjusted score (emphasizes high-risk areas)
        risk_multiplier = CoverageCalculator._calculate_risk_multiplier(project_id)
        risk_adjusted_score = total_score * risk_multiplier
        
        return {
            'functional_coverage': cf,
            'data_coverage': cd,
            'journey_coverage': cj,
            'risk_coverage': cr,
            'environmental_coverage': ce,
            'total_coverage_score': round(total_score, 2),
            'risk_adjusted_score': round(risk_adjusted_score, 2),
            'weights': {
                'functional': project.functional_weight,
                'data': project.data_weight,
                'journey': project.journey_weight,
                'risk': project.risk_weight,
                'environmental': project.environmental_weight
            }
        }
    
    @staticmethod
    def _calculate_risk_multiplier(project_id: int) -> float:
        """Calculate risk multiplier based on coverage of high-risk items"""
        from .models import Feature, db
        
        features = Feature.query.filter_by(project_id=project_id).all()
        if not features:
            return 1.0
            
        high_risk_features = [f for f in features if f.risk_score >= 4]
        if not high_risk_features:
            return 1.0
            
        covered_high_risk = sum(
            1 for f in high_risk_features 
            if f.status == 'covered'
        )
        
        high_risk_coverage = covered_high_risk / len(high_risk_features)
        
        # Risk multiplier: 0.8 to 1.2 based on high-risk coverage
        return 0.8 + (0.4 * high_risk_coverage)

class GapAnalyzer:
    """
    Advanced gap analysis and recommendation engine
    """
    
    @staticmethod
    def detect_coverage_gaps(project_id: int) -> Dict[str, List[Dict]]:
        """
        Comprehensive gap detection across all dimensions
        """
        gaps = {
            'feature_gaps': GapAnalyzer._find_feature_gaps(project_id),
            'boundary_gaps': GapAnalyzer._find_boundary_gaps(project_id),
            'integration_gaps': GapAnalyzer._find_integration_gaps(project_id),
            'journey_gaps': GapAnalyzer._find_journey_gaps(project_id),
            'environmental_gaps': GapAnalyzer._find_environmental_gaps(project_id)
        }
        
        return gaps
    
    @staticmethod
    def _find_feature_gaps(project_id: int) -> List[Dict]:
        """Find features with no or insufficient test coverage"""
        from .models import Feature, db
        
        features = Feature.query.filter_by(project_id=project_id).all()
        gaps = []
        
        for feature in features:
            if feature.status == 'uncovered':
                gap_severity = GapAnalyzer._calculate_gap_severity(feature)
                gaps.append({
                    'type': 'uncovered_feature',
                    'feature_id': feature.id,
                    'feature_name': feature.name,
                    'priority': feature.priority,
                    'business_impact': feature.business_impact,
                    'risk_score': feature.risk_score,
                    'severity': gap_severity,
                    'recommendation': f"Implement test coverage for {feature.name}"
                })
            elif feature.status == 'partial' and feature.get_coverage_percentage() < 50:
                gaps.append({
                    'type': 'partial_coverage',
                    'feature_id': feature.id,
                    'feature_name': feature.name,
                    'coverage_percentage': feature.get_coverage_percentage(),
                    'severity': 'medium',
                    'recommendation': f"Increase test coverage for {feature.name}"
                })
        
        return sorted(gaps, key=lambda x: x.get('severity', 'low'), reverse=True)
    
    @staticmethod
    def _find_boundary_gaps(project_id: int) -> List[Dict]:
        """Find missing boundary value testing"""
        from .models import DataCoverageScenario, db
        
        scenarios = DataCoverageScenario.query.filter_by(project_id=project_id).all()
        gaps = []
        
        for scenario in scenarios:
            if scenario.boundary_tests == 0:
                gaps.append({
                    'type': 'missing_boundary_tests',
                    'parameter': scenario.parameter_name,
                    'parameter_type': scenario.parameter_type,
                    'severity': 'high',
                    'recommendation': f"Add boundary value tests for {scenario.parameter_name}"
                })
            elif scenario.error_tests == 0:
                gaps.append({
                    'type': 'missing_error_tests',
                    'parameter': scenario.parameter_name,
                    'severity': 'medium',
                    'recommendation': f"Add error handling tests for {scenario.parameter_name}"
                })
        
        return gaps
    
    @staticmethod
    def _find_integration_gaps(project_id: int) -> List[Dict]:
        """Find untested component interactions"""
        from .models import Feature, TestCase, db
        
        features = Feature.query.filter_by(project_id=project_id).all()
        integration_tests = TestCase.query.filter_by(
            project_id=project_id, 
            type='integration'
        ).all()
        
        gaps = []
        
        # Check for features without integration tests
        features_with_integration = {tc.feature_id for tc in integration_tests if tc.feature_id}
        
        for feature in features:
            if feature.id not in features_with_integration and feature.priority == 'high':
                gaps.append({
                    'type': 'missing_integration_tests',
                    'feature_id': feature.id,
                    'feature_name': feature.name,
                    'severity': 'high',
                    'recommendation': f"Add integration tests for {feature.name}"
                })
        
        return gaps
    
    @staticmethod
    def _find_journey_gaps(project_id: int) -> List[Dict]:
        """Find incomplete critical user journeys"""
        from .models import UserJourney, db
        
        journeys = UserJourney.query.filter_by(project_id=project_id).all()
        gaps = []
        
        for journey in journeys:
            if journey.business_impact in ['critical', 'high']:
                if journey.test_status == 'not_tested':
                    gaps.append({
                        'type': 'untested_critical_journey',
                        'journey_id': journey.id,
                        'journey_name': journey.name,
                        'business_impact': journey.business_impact,
                        'severity': 'critical',
                        'recommendation': f"Implement tests for critical journey: {journey.name}"
                    })
                elif journey.test_status == 'failed':
                    gaps.append({
                        'type': 'failing_critical_journey',
                        'journey_id': journey.id,
                        'journey_name': journey.name,
                        'severity': 'critical',
                        'recommendation': f"Fix failing critical journey: {journey.name}"
                    })
        
        return gaps
    
    @staticmethod
    def _find_environmental_gaps(project_id: int) -> List[Dict]:
        """Find untested required environments"""
        from .models import Environment, db
        
        environments = Environment.query.filter_by(
            project_id=project_id, 
            is_required=True,
            is_tested=False
        ).all()
        
        gaps = []
        for env in environments:
            gaps.append({
                'type': 'untested_environment',
                'environment_id': env.id,
                'environment_name': env.name,
                'platform': env.platform,
                'severity': 'medium',
                'recommendation': f"Test on {env.name} ({env.platform})"
            })
        
        return gaps
    
    @staticmethod
    def _calculate_gap_severity(feature) -> str:
        """Calculate gap severity based on business impact and risk"""
        if feature.business_impact == 'critical' and feature.risk_score >= 4:
            return 'critical'
        elif feature.business_impact in ['critical', 'high'] or feature.risk_score >= 3:
            return 'high'
        elif feature.business_impact == 'medium' or feature.risk_score >= 2:
            return 'medium'
        else:
            return 'low'

class RecommendationGenerator:
    """
    AI-powered recommendation engine for testing priorities
    """
    
    @staticmethod
    def generate_comprehensive_recommendations(project_id: int) -> List[Dict]:
        """
        Generate prioritized recommendations based on gap analysis and ML insights
        """
        # Get coverage gaps
        gaps = GapAnalyzer.detect_coverage_gaps(project_id)
        
        # Generate recommendations for each gap type
        recommendations = []
        
        # Priority 1: Critical feature gaps
        for gap in gaps['feature_gaps']:
            if gap.get('severity') == 'critical':
                recommendations.append({
                    'priority': 1,
                    'type': 'critical_feature_gap',
                    'title': f"Critical: Test {gap['feature_name']}",
                    'description': gap['recommendation'],
                    'impact_score': RecommendationGenerator._calculate_impact_score(gap),
                    'effort_estimate': RecommendationGenerator._estimate_effort(gap),
                    'business_justification': f"Critical feature {gap['feature_name']} has no test coverage",
                    'risk_mitigation': "Prevents production issues in critical functionality",
                    'related_features': [gap['feature_id']]
                })
        
        # Priority 2: Journey gaps
        for gap in gaps['journey_gaps']:
            recommendations.append({
                'priority': 2,
                'type': 'journey_gap',
                'title': f"Test Critical Journey: {gap['journey_name']}",
                'description': gap['recommendation'],
                'impact_score': 85 if gap['severity'] == 'critical' else 65,
                'effort_estimate': 'days',
                'business_justification': f"Critical user journey {gap['journey_name']} is not tested",
                'risk_mitigation': "Ensures core user workflows function correctly",
                'related_journeys': [gap['journey_id']]
            })
        
        # Priority 3: Integration gaps
        for gap in gaps['integration_gaps']:
            recommendations.append({
                'priority': 3,
                'type': 'integration_gap',
                'title': f"Add Integration Tests: {gap['feature_name']}",
                'description': gap['recommendation'],
                'impact_score': 70,
                'effort_estimate': 'days',
                'business_justification': "Integration testing prevents component interaction issues",
                'risk_mitigation': "Catches integration bugs early",
                'related_features': [gap['feature_id']]
            })
        
        # Priority 4: Boundary testing gaps
        for gap in gaps['boundary_gaps']:
            recommendations.append({
                'priority': 4,
                'type': 'boundary_gap',
                'title': f"Boundary Tests: {gap['parameter']}",
                'description': gap['recommendation'],
                'impact_score': 60,
                'effort_estimate': 'hours',
                'business_justification': "Boundary testing catches edge case bugs",
                'risk_mitigation': "Prevents edge case failures",
                'related_features': []
            })
        
        # Sort by priority and impact score
        recommendations.sort(key=lambda x: (x['priority'], -x['impact_score']))
        
        return recommendations[:10]  # Top 10 recommendations
    
    @staticmethod
    def _calculate_impact_score(gap: Dict) -> float:
        """Calculate business impact score for a gap"""
        base_score = 50
        
        # Business impact multiplier
        impact_multipliers = {'critical': 1.8, 'high': 1.5, 'medium': 1.2, 'low': 1.0}
        impact_mult = impact_multipliers.get(gap.get('business_impact', 'medium'), 1.0)
        
        # Risk score multiplier
        risk_mult = 1 + (gap.get('risk_score', 1) * 0.1)
        
        # Priority multiplier
        priority_multipliers = {'high': 1.5, 'medium': 1.2, 'low': 1.0}
        priority_mult = priority_multipliers.get(gap.get('priority', 'medium'), 1.0)
        
        return round(base_score * impact_mult * risk_mult * priority_mult, 1)
    
    @staticmethod
    def _estimate_effort(gap: Dict) -> str:
        """Estimate effort required to address the gap"""
        gap_type = gap.get('type', '')
        
        if gap_type in ['uncovered_feature', 'missing_integration_tests']:
            return 'days'
        elif gap_type in ['partial_coverage', 'untested_critical_journey']:
            return 'hours'
        elif gap_type in ['missing_boundary_tests', 'missing_error_tests']:
            return 'hours'
        else:
            return 'days'

class TrendAnalyzer:
    """
    Analyze coverage trends over time
    """
    
    @staticmethod
    def analyze_coverage_trends(project_id: int, days_back: int = 30) -> Dict[str, Any]:
        """
        Analyze coverage trends over the specified time period
        """
        from .models import CoverageReport, db
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days_back)
        
        reports = CoverageReport.query.filter(
            CoverageReport.project_id == project_id,
            CoverageReport.report_date >= start_date,
            CoverageReport.report_date <= end_date
        ).order_by(CoverageReport.report_date).all()
        
        if len(reports) < 2:
            return {'trend': 'insufficient_data', 'message': 'Need at least 2 data points'}
        
        # Calculate trends for each dimension
        trends = {}
        dimensions = ['functional_coverage', 'data_coverage', 'journey_coverage', 
                     'risk_coverage', 'environmental_coverage', 'total_coverage_score']
        
        for dimension in dimensions:
            values = [getattr(report, dimension) for report in reports]
            trend = TrendAnalyzer._calculate_trend(values)
            trends[dimension] = trend
        
        # Overall assessment
        overall_trend = TrendAnalyzer._assess_overall_trend(trends)
        
        return {
            'period_days': days_back,
            'reports_analyzed': len(reports),
            'trends': trends,
            'overall_trend': overall_trend,
            'latest_score': reports[-1].total_coverage_score if reports else 0,
            'score_change': reports[-1].total_coverage_score - reports[0].total_coverage_score if len(reports) >= 2 else 0
        }
    
    @staticmethod
    def _calculate_trend(values: List[float]) -> Dict[str, Any]:
        """Calculate trend statistics for a series of values"""
        if len(values) < 2:
            return {'direction': 'stable', 'change': 0, 'velocity': 0}
        
        # Calculate linear trend
        x = np.arange(len(values))
        y = np.array(values)
        
        # Linear regression
        slope, intercept = np.polyfit(x, y, 1)
        
        # Trend direction
        if abs(slope) < 0.1:
            direction = 'stable'
        elif slope > 0:
            direction = 'improving'
        else:
            direction = 'declining'
        
        # Calculate percentage change
        change = ((values[-1] - values[0]) / values[0] * 100) if values[0] != 0 else 0
        
        return {
            'direction': direction,
            'change': round(change, 2),
            'velocity': round(slope, 3),
            'current_value': values[-1],
            'previous_value': values[0]
        }
    
    @staticmethod
    def _assess_overall_trend(trends: Dict) -> str:
        """Assess overall trend across all dimensions"""
        improving_count = sum(1 for trend in trends.values() if trend['direction'] == 'improving')
        declining_count = sum(1 for trend in trends.values() if trend['direction'] == 'declining')
        
        if improving_count > declining_count:
            return 'improving'
        elif declining_count > improving_count:
            return 'declining'
        else:
            return 'stable'
