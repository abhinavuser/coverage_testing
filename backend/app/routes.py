from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from . import db
from .models import (
    Project, Feature, TestCase, UserJourney, Environment, 
    DataCoverageScenario, CoverageReport, RecommendationEngine
)
from .utils import CoverageCalculator, GapAnalyzer, RecommendationGenerator
from .ml_engine import MLRecommendationEngine

api = Blueprint('api', __name__)

# ========== PROJECT MANAGEMENT ==========

@api.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'created_at': p.created_at.isoformat(),
        'feature_count': len(p.features),
        'test_case_count': len(p.test_cases)
    } for p in projects])

@api.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(
        name=data['name'],
        description=data.get('description', ''),
        functional_weight=data.get('functional_weight', 0.25),
        data_weight=data.get('data_weight', 0.20),
        journey_weight=data.get('journey_weight', 0.25),
        risk_weight=data.get('risk_weight', 0.20),
        environmental_weight=data.get('environmental_weight', 0.10)
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'message': 'Project created', 'project_id': project.id}), 201

@api.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'weights': {
            'functional': project.functional_weight,
            'data': project.data_weight,
            'journey': project.journey_weight,
            'risk': project.risk_weight,
            'environmental': project.environmental_weight
        }
    })

# ========== FEATURE MANAGEMENT ==========

@api.route('/projects/<int:project_id>/features', methods=['GET'])
def get_features(project_id):
    features = Feature.query.filter_by(project_id=project_id).all()
    return jsonify([{
        'id': f.id,
        'feature_id': f.feature_id,
        'name': f.name,
        'priority': f.priority,
        'complexity': f.complexity,
        'business_impact': f.business_impact,
        'risk_score': f.risk_score,
        'status': f.status,
        'coverage_percentage': f.get_coverage_percentage(),
        'test_cases': {
            'total': f.total_test_cases,
            'passed': f.passed_test_cases,
            'failed': f.failed_test_cases
        }
    } for f in features])

@api.route('/projects/<int:project_id>/features', methods=['POST'])
def create_feature(project_id):
    data = request.json
    feature = Feature(
        project_id=project_id,
        feature_id=data['feature_id'],
        name=data['name'],
        description=data.get('description', ''),
        priority=data['priority'],
        complexity=data['complexity'],
        business_impact=data['business_impact'],
        risk_score=data.get('risk_score', 1),
        status=data.get('status', 'uncovered')
    )
    db.session.add(feature)
    db.session.commit()
    return jsonify({'message': 'Feature created', 'feature_id': feature.id}), 201

# ========== COVERAGE ANALYSIS ==========

@api.route('/projects/<int:project_id>/coverage/calculate', methods=['POST'])
def calculate_coverage(project_id):
    coverage_data = CoverageCalculator.calculate_total_coverage_score(project_id)
    if not coverage_data:
        return jsonify({'error': 'Project not found'}), 404
    
    # Save coverage report
    report = CoverageReport(
        project_id=project_id,
        functional_coverage=coverage_data['functional_coverage'],
        data_coverage=coverage_data['data_coverage'],
        journey_coverage=coverage_data['journey_coverage'],
        risk_coverage=coverage_data['risk_coverage'],
        environmental_coverage=coverage_data['environmental_coverage'],
        total_coverage_score=coverage_data['total_coverage_score'],
        risk_adjusted_score=coverage_data['risk_adjusted_score'],
        metrics_json=coverage_data
    )
    db.session.add(report)
    db.session.commit()
    
    return jsonify({
        'message': 'Coverage calculated',
        'report_id': report.id,
        'coverage': coverage_data
    })

@api.route('/projects/<int:project_id>/coverage/latest', methods=['GET'])
def get_latest_coverage(project_id):
    report = CoverageReport.query.filter_by(project_id=project_id)\
                                .order_by(CoverageReport.report_date.desc())\
                                .first()
    if not report:
        return jsonify({'error': 'No coverage reports found'}), 404
    
    return jsonify({
        'functional_coverage': report.functional_coverage,
        'data_coverage': report.data_coverage,
        'journey_coverage': report.journey_coverage,
        'risk_coverage': report.risk_coverage,
        'environmental_coverage': report.environmental_coverage,
        'total_coverage_score': report.total_coverage_score,
        'risk_adjusted_score': report.risk_adjusted_score
    })

# ========== GAP ANALYSIS ==========

@api.route('/projects/<int:project_id>/gaps/analyze', methods=['POST'])
def analyze_gaps(project_id):
    gaps = GapAnalyzer.detect_coverage_gaps(project_id)
    gap_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}
    
    for gap_type, gap_list in gaps.items():
        for gap in gap_list:
            severity = gap.get('severity', 'low')
            gap_counts[severity] += 1
    
    return jsonify({
        'project_id': project_id,
        'gap_summary': gap_counts,
        'detailed_gaps': gaps,
        'total_gaps': sum(gap_counts.values())
    })

# ========== RECOMMENDATIONS ==========

@api.route('/projects/<int:project_id>/recommendations/generate', methods=['POST'])
def generate_recommendations(project_id):
    recommendations = RecommendationGenerator.generate_comprehensive_recommendations(project_id)
    
    # Save to database
    for rec_data in recommendations:
        recommendation = RecommendationEngine(
            project_id=project_id,
            recommendation_type=rec_data['type'],
            priority=rec_data['priority'],
            title=rec_data['title'],
            description=rec_data['description'],
            impact_score=rec_data['impact_score'],
            effort_estimate=rec_data['effort_estimate'],
            business_impact=rec_data['business_justification'],
            risk_mitigation=rec_data['risk_mitigation']
        )
        db.session.add(recommendation)
    
    db.session.commit()
    return jsonify({
        'message': 'Recommendations generated',
        'recommendation_count': len(recommendations),
        'recommendations': recommendations
    })

@api.route('/projects/<int:project_id>/recommendations', methods=['GET'])
def get_recommendations(project_id):
    recommendations = RecommendationEngine.query.filter_by(project_id=project_id)\
                                                .order_by(RecommendationEngine.priority.asc())\
                                                .limit(10).all()
    
    return jsonify([{
        'id': r.id,
        'type': r.recommendation_type,
        'priority': r.priority,
        'title': r.title,
        'description': r.description,
        'impact_score': r.impact_score,
        'effort_estimate': r.effort_estimate,
        'status': r.status
    } for r in recommendations])

# ========== DASHBOARD ==========

@api.route('/projects/<int:project_id>/dashboard', methods=['GET'])
def get_dashboard_data(project_id):
    # Get latest coverage
    latest_coverage = CoverageReport.query.filter_by(project_id=project_id)\
                                         .order_by(CoverageReport.report_date.desc())\
                                         .first()
    
    # Get feature stats
    features = Feature.query.filter_by(project_id=project_id).all()
    feature_stats = {
        'total': len(features),
        'covered': sum(1 for f in features if f.status == 'covered'),
        'partial': sum(1 for f in features if f.status == 'partial'),
        'uncovered': sum(1 for f in features if f.status == 'uncovered')
    }
    
    return jsonify({
        'project_id': project_id,
        'coverage_summary': {
            'functional': latest_coverage.functional_coverage if latest_coverage else 0,
            'data': latest_coverage.data_coverage if latest_coverage else 0,
            'journey': latest_coverage.journey_coverage if latest_coverage else 0,
            'risk': latest_coverage.risk_coverage if latest_coverage else 0,
            'environmental': latest_coverage.environmental_coverage if latest_coverage else 0,
            'total_score': latest_coverage.total_coverage_score if latest_coverage else 0
        },
        'feature_statistics': feature_stats
    })

# ========== GLOBAL COVERAGE ANALYSIS ==========

@api.route('/coverage/overall', methods=['GET'])
def get_overall_coverage():
    """
    GET /coverage/overall → returns overall coverage percentage across all projects
    """
    try:
        # Get all projects and calculate overall coverage
        projects = Project.query.all()
        if not projects:
            return jsonify({
                'overall_coverage': 0.0,
                'total_projects': 0,
                'message': 'No projects found'
            })
        
        total_coverage = 0
        valid_projects = 0
        
        for project in projects:
            coverage_data = CoverageCalculator.calculate_total_coverage_score(project.id)
            if coverage_data:
                total_coverage += coverage_data.get('total_coverage_score', 0)
                valid_projects += 1
        
        overall_percentage = round(total_coverage / valid_projects, 2) if valid_projects > 0 else 0.0
        
        return jsonify({
            'overall_coverage': overall_percentage,
            'total_projects': len(projects),
            'active_projects': valid_projects,
            'coverage_distribution': {
                'excellent': sum(1 for p in projects if CoverageCalculator.calculate_total_coverage_score(p.id).get('total_coverage_score', 0) >= 80),
                'good': sum(1 for p in projects if 60 <= CoverageCalculator.calculate_total_coverage_score(p.id).get('total_coverage_score', 0) < 80),
                'needs_improvement': sum(1 for p in projects if CoverageCalculator.calculate_total_coverage_score(p.id).get('total_coverage_score', 0) < 60)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/coverage/risk-areas', methods=['GET'])
def get_risk_areas():
    """
    GET /coverage/risk-areas → returns functions/features predicted as "uncovered" with high risk
    """
    try:
        project_id = request.args.get('project_id')
        
        if project_id:
            # Get risk areas for specific project
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            # Get risk areas across all projects
            features = Feature.query.all()
        
        risk_areas = []
        
        for feature in features:
            # Identify high-risk uncovered features
            if feature.status in ['uncovered', 'partial'] and feature.risk_score >= 3:
                risk_prediction = {
                    'feature_id': feature.feature_id,
                    'feature_name': feature.name,
                    'project_id': feature.project_id,
                    'project_name': feature.project.name,
                    'risk_score': feature.risk_score,
                    'business_impact': feature.business_impact,
                    'complexity': feature.complexity,
                    'priority': feature.priority,
                    'status': feature.status,
                    'coverage_percentage': feature.get_coverage_percentage(),
                    'risk_weight': feature.get_risk_weight(),
                    'prediction_confidence': round(min(feature.risk_score * 20, 100), 1),
                    'reasons': []
                }
                
                # Add prediction reasons
                if feature.status == 'uncovered':
                    risk_prediction['reasons'].append('No test coverage detected')
                if feature.business_impact in ['critical', 'high']:
                    risk_prediction['reasons'].append(f'{feature.business_impact.title()} business impact')
                if feature.complexity == 'high':
                    risk_prediction['reasons'].append('High complexity increases failure risk')
                if feature.risk_score >= 4:
                    risk_prediction['reasons'].append('High risk score assigned')
                
                risk_areas.append(risk_prediction)
        
        # Sort by risk score and prediction confidence
        risk_areas.sort(key=lambda x: (x['risk_score'], x['prediction_confidence']), reverse=True)
        
        return jsonify({
            'total_risk_areas': len(risk_areas),
            'high_risk_count': sum(1 for r in risk_areas if r['risk_score'] >= 4),
            'critical_impact_count': sum(1 for r in risk_areas if r['business_impact'] == 'critical'),
            'risk_areas': risk_areas[:20]  # Top 20 risk areas
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/coverage/clusters', methods=['GET'])
def get_coverage_clusters():
    """
    GET /coverage/clusters → returns grouped clusters of features based on ML analysis
    """
    try:
        project_id = request.args.get('project_id')
        
        if project_id:
            # Get clusters for specific project
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            # Get clusters across all projects
            features = Feature.query.all()
        
        if not features:
            return jsonify({
                'clusters': [],
                'total_features': 0,
                'message': 'No features found for clustering'
            })
        
        # Prepare feature data for ML clustering
        features_data = []
        for feature in features:
            features_data.append({
                'id': feature.id,
                'name': feature.name,
                'priority': feature.priority,
                'complexity': feature.complexity,
                'business_impact': feature.business_impact,
                'risk_score': feature.risk_score,
                'status': feature.status,
                'coverage_percentage': feature.get_coverage_percentage(),
                'project_id': feature.project_id,
                'project_name': feature.project.name
            })
        
        # Use ML engine for clustering
        ml_recommendations = MLRecommendationEngine.generate_ai_recommendations(features_data)
        
        # Group features by clusters based on similar characteristics
        clusters = {}
        for i, feature_data in enumerate(features_data):
            # Simple clustering based on risk and status
            cluster_key = f"{feature_data['business_impact']}_{feature_data['status']}"
            
            if cluster_key not in clusters:
                clusters[cluster_key] = {
                    'cluster_id': len(clusters) + 1,
                    'cluster_name': f"{feature_data['business_impact'].title()} Impact - {feature_data['status'].title()}",
                    'characteristics': {
                        'business_impact': feature_data['business_impact'],
                        'status': feature_data['status'],
                        'avg_risk_score': 0,
                        'avg_coverage': 0
                    },
                    'features': [],
                    'feature_count': 0,
                    'recommendations': []
                }
            
            clusters[cluster_key]['features'].append(feature_data)
            clusters[cluster_key]['feature_count'] += 1
        
        # Calculate cluster statistics
        for cluster_key, cluster_data in clusters.items():
            features_in_cluster = cluster_data['features']
            cluster_data['characteristics']['avg_risk_score'] = round(
                sum(f['risk_score'] for f in features_in_cluster) / len(features_in_cluster), 2
            )
            cluster_data['characteristics']['avg_coverage'] = round(
                sum(f['coverage_percentage'] for f in features_in_cluster) / len(features_in_cluster), 2
            )
            
            # Add cluster-specific recommendations
            if cluster_data['characteristics']['status'] == 'uncovered':
                cluster_data['recommendations'].append('Prioritize test development for this cluster')
            if cluster_data['characteristics']['business_impact'] in ['critical', 'high']:
                cluster_data['recommendations'].append('High business impact - immediate attention required')
        
        # Convert to list and sort by priority
        cluster_list = list(clusters.values())
        cluster_list.sort(key=lambda x: (
            x['characteristics']['avg_risk_score'],
            1 if x['characteristics']['business_impact'] == 'critical' else 0
        ), reverse=True)
        
        return jsonify({
            'total_clusters': len(cluster_list),
            'total_features': len(features_data),
            'clustering_method': 'Risk-based and Status-based ML clustering',
            'clusters': cluster_list
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/coverage/recommendations', methods=['GET'])
def get_coverage_recommendations():
    """
    GET /coverage/recommendations → suggests which high-priority uncovered functions to test next
    """
    try:
        project_id = request.args.get('project_id')
        limit = int(request.args.get('limit', 10))
        
        if project_id:
            # Get recommendations for specific project
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            # Get recommendations across all projects
            features = Feature.query.all()
        
        if not features:
            return jsonify({
                'recommendations': [],
                'total_features_analyzed': 0,
                'message': 'No features found for analysis'
            })
        
        # Prepare feature data for ML analysis
        features_data = []
        for feature in features:
            features_data.append({
                'id': feature.id,
                'name': feature.name,
                'feature_id': feature.feature_id,
                'priority': feature.priority,
                'complexity': feature.complexity,
                'business_impact': feature.business_impact,
                'risk_score': feature.risk_score,
                'status': feature.status,
                'coverage_percentage': feature.get_coverage_percentage(),
                'project_id': feature.project_id,
                'project_name': feature.project.name,
                'total_test_cases': feature.total_test_cases,
                'passed_test_cases': feature.passed_test_cases
            })
        
        # Generate ML-powered recommendations
        ml_recommendations = MLRecommendationEngine.generate_ai_recommendations(features_data)
        
        # Focus on high-priority uncovered functions
        prioritized_recommendations = []
        
        for feature_data in features_data:
            if feature_data['status'] in ['uncovered', 'partial']:
                # Calculate priority score
                priority_score = 0
                
                # Business impact weight
                impact_weights = {'critical': 50, 'high': 40, 'medium': 25, 'low': 10}
                priority_score += impact_weights.get(feature_data['business_impact'], 10)
                
                # Risk score weight
                priority_score += feature_data['risk_score'] * 10
                
                # Priority weight
                priority_weights = {'high': 30, 'medium': 20, 'low': 10}
                priority_score += priority_weights.get(feature_data['priority'], 10)
                
                # Coverage penalty (lower coverage = higher priority)
                coverage_penalty = (100 - feature_data['coverage_percentage']) * 0.5
                priority_score += coverage_penalty
                
                recommendation = {
                    'feature_id': feature_data['feature_id'],
                    'feature_name': feature_data['name'],
                    'project_id': feature_data['project_id'],
                    'project_name': feature_data['project_name'],
                    'priority_score': round(priority_score, 1),
                    'current_status': feature_data['status'],
                    'current_coverage': feature_data['coverage_percentage'],
                    'business_impact': feature_data['business_impact'],
                    'risk_score': feature_data['risk_score'],
                    'complexity': feature_data['complexity'],
                    'recommendation_type': 'test_development' if feature_data['status'] == 'uncovered' else 'coverage_improvement',
                    'suggested_actions': [],
                    'estimated_effort': 'unknown',
                    'business_justification': '',
                    'expected_impact': ''
                }
                
                # Add specific recommendations
                if feature_data['status'] == 'uncovered':
                    recommendation['suggested_actions'].extend([
                        'Create initial test cases',
                        'Define test scenarios',
                        'Implement automated tests'
                    ])
                    recommendation['estimated_effort'] = 'days' if feature_data['complexity'] == 'high' else 'hours'
                    recommendation['expected_impact'] = f"Reduce risk for {feature_data['business_impact']} impact feature"
                else:  # partial coverage
                    recommendation['suggested_actions'].extend([
                        'Add missing test cases',
                        'Improve edge case coverage',
                        'Enhance test assertions'
                    ])
                    recommendation['estimated_effort'] = 'hours'
                    recommendation['expected_impact'] = f"Increase coverage from {feature_data['coverage_percentage']}% to 80%+"
                
                # Business justification
                justifications = {
                    'critical': 'Essential for business continuity and user satisfaction',
                    'high': 'Significantly reduces business risk and improves reliability',
                    'medium': 'Improves overall system quality and user experience',
                    'low': 'Provides additional quality assurance'
                }
                recommendation['business_justification'] = justifications.get(
                    feature_data['business_impact'], 'Improves test coverage'
                )
                
                prioritized_recommendations.append(recommendation)
        
        # Sort by priority score
        prioritized_recommendations.sort(key=lambda x: x['priority_score'], reverse=True)
        
        # Limit results
        top_recommendations = prioritized_recommendations[:limit]
        
        # Add summary statistics
        summary = {
            'total_features_analyzed': len(features_data),
            'uncovered_features': sum(1 for f in features_data if f['status'] == 'uncovered'),
            'partial_coverage_features': sum(1 for f in features_data if f['status'] == 'partial'),
            'high_priority_recommendations': sum(1 for r in top_recommendations if r['priority_score'] >= 80),
            'critical_impact_features': sum(1 for f in features_data if f['business_impact'] == 'critical' and f['status'] != 'covered'),
            'average_coverage': round(sum(f['coverage_percentage'] for f in features_data) / len(features_data), 2) if features_data else 0
        }
        
        return jsonify({
            'summary': summary,
            'recommendations': top_recommendations,
            'algorithm': 'ML-enhanced priority scoring with business impact weighting',
            'total_recommendations': len(prioritized_recommendations)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500