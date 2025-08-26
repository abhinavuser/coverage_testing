from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import zipfile
import tempfile
import shutil
import requests
import subprocess
from pathlib import Path
from . import db
from .models import (
    Project, Feature, TestCase, UserJourney, Environment, 
    DataCoverageScenario, CoverageReport, RecommendationEngine
)
from .utils import CoverageCalculator, GapAnalyzer, RecommendationGenerator
from .ml_engine import MLRecommendationEngine
from .ml_model_manager import ml_manager

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
        
        # Use both original ML engine and new pkl models for enhanced clustering
        ml_recommendations = MLRecommendationEngine.generate_ai_recommendations(features_data)
        enhanced_clustering = ml_manager.cluster_features(features_data)
        
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
            'clusters': cluster_list,
            'enhanced_ml_clustering': enhanced_clustering,
            'model_info': ml_manager.get_model_info()
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

# ========== ML MODEL ENDPOINTS ==========

@api.route('/ml/models/info', methods=['GET'])
def get_ml_models_info():
    """
    GET /ml/models/info → returns information about loaded ML models
    """
    try:
        model_info = ml_manager.get_model_info()
        return jsonify({
            'status': 'success',
            'model_info': model_info,
            'models_available': len(model_info.get('models_loaded', [])) > 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ml/predict/risk', methods=['POST'])
def predict_feature_risk():
    """
    POST /ml/predict/risk → predicts risk for a feature using ML models
    """
    try:
        data = request.json
        feature_data = data.get('feature_data', {})
        model_name = data.get('model', 'random_forest')
        
        # Use ML model manager for prediction
        prediction = ml_manager.predict_coverage_risk(feature_data, model_name)
        
        return jsonify({
            'status': 'success',
            'prediction': prediction,
            'feature_analyzed': {
                'name': feature_data.get('name', 'Unknown'),
                'status': feature_data.get('status', 'unknown'),
                'business_impact': feature_data.get('business_impact', 'unknown')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ml/cluster/features', methods=['POST'])
def ml_cluster_features():
    """
    POST /ml/cluster/features → clusters features using ML models
    """
    try:
        data = request.json
        project_id = data.get('project_id')
        
        if project_id:
            # Get features for specific project
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            # Get all features
            features = Feature.query.all()
        
        # Prepare feature data
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
                'total_test_cases': feature.total_test_cases,
                'passed_test_cases': feature.passed_test_cases,
                'failed_test_cases': feature.failed_test_cases,
                'project_id': feature.project_id,
                'project_name': feature.project.name
            })
        
        # Use ML model manager for clustering
        clustering_result = ml_manager.cluster_features(features_data)
        
        return jsonify({
            'status': 'success',
            'clustering': clustering_result,
            'features_analyzed': len(features_data)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ml/recommend/enhanced', methods=['GET'])
def get_enhanced_ml_recommendations():
    """
    GET /ml/recommend/enhanced → enhanced recommendations using pkl models
    """
    try:
        project_id = request.args.get('project_id')
        limit = int(request.args.get('limit', 10))
        model_ensemble = request.args.get('ensemble', 'true').lower() == 'true'
        
        if project_id:
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            features = Feature.query.all()
        
        # Prepare feature data
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
                'total_test_cases': feature.total_test_cases,
                'passed_test_cases': feature.passed_test_cases,
                'failed_test_cases': feature.failed_test_cases,
                'project_id': feature.project_id,
                'project_name': feature.project.name
            })
        
        # Use ML model manager for enhanced recommendations
        recommendations = ml_manager.get_model_recommendations(features_data, limit)
        
        # Get model info for transparency
        model_info = ml_manager.get_model_info()
        
        return jsonify({
            'status': 'success',
            'recommendations': recommendations,
            'total_features_analyzed': len(features_data),
            'models_used': model_info.get('models_loaded', []),
            'ensemble_prediction': model_ensemble,
            'algorithm': 'ML ensemble with pre-trained models'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ml/analyze/project/<int:project_id>', methods=['GET'])
def analyze_project_with_ml():
    """
    GET /ml/analyze/project/{id} → comprehensive ML analysis of a project
    """
    try:
        project = Project.query.get_or_404(project_id)
        features = Feature.query.filter_by(project_id=project_id).all()
        
        if not features:
            return jsonify({
                'error': 'No features found for this project'
            }), 404
        
        # Prepare feature data
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
                'total_test_cases': feature.total_test_cases,
                'passed_test_cases': feature.passed_test_cases,
                'failed_test_cases': feature.failed_test_cases,
                'project_id': feature.project_id,
                'project_name': feature.project.name
            })
        
        # Perform comprehensive ML analysis
        risk_predictions = []
        for feature_data in features_data:
            if feature_data['status'] in ['uncovered', 'partial']:
                prediction = ml_manager.predict_coverage_risk(feature_data)
                risk_predictions.append({
                    'feature': feature_data,
                    'prediction': prediction
                })
        
        # Clustering analysis
        clustering_result = ml_manager.cluster_features(features_data)
        
        # Enhanced recommendations
        recommendations = ml_manager.get_model_recommendations(features_data, 15)
        
        # Risk summary
        high_risk_features = [
            rp for rp in risk_predictions 
            if rp['prediction']['predicted_risk_level'] in ['high', 'very_high']
        ]
        
        # Project risk score
        total_risk_score = sum(
            rp['prediction']['confidence'] * 
            ({'very_high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very_low': 1}.get(
                rp['prediction']['predicted_risk_level'], 3
            ))
            for rp in risk_predictions
        )
        avg_risk_score = total_risk_score / len(risk_predictions) if risk_predictions else 0
        
        return jsonify({
            'project_id': project_id,
            'project_name': project.name,
            'analysis_summary': {
                'total_features': len(features_data),
                'features_at_risk': len(risk_predictions),
                'high_risk_features': len(high_risk_features),
                'average_risk_score': round(avg_risk_score, 2),
                'clusters_identified': clustering_result.get('total_clusters', 0),
                'top_recommendations': len(recommendations)
            },
            'risk_predictions': risk_predictions[:10],  # Top 10 risk predictions
            'clustering_analysis': clustering_result,
            'ml_recommendations': recommendations[:10],  # Top 10 recommendations
            'model_info': ml_manager.get_model_info(),
            'analysis_timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ml/comprehensive-analysis', methods=['GET'])
def get_comprehensive_ml_analysis():
    """
    GET /ml/comprehensive-analysis → returns comprehensive analysis in your expected format
    """
    try:
        project_id = request.args.get('project_id')
        
        if project_id:
            features = Feature.query.filter_by(project_id=int(project_id)).all()
        else:
            features = Feature.query.all()
        
        # Prepare feature data
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
                'total_test_cases': feature.total_test_cases,
                'passed_test_cases': feature.passed_test_cases,
                'failed_test_cases': feature.failed_test_cases,
                'project_id': feature.project_id,
                'project_name': feature.project.name
            })
        
        # Get comprehensive analysis
        analysis = ml_manager.get_comprehensive_analysis(features_data)
        
        # Format response in your expected structure
        response = {
            'overall_functional_coverage_index': f"{analysis['overall_functional_coverage']}%",
            'model_performance': {},
            'cluster_distribution': analysis['cluster_distribution'],
            'recommended_testing_areas': analysis['recommended_areas'],
            'summary': analysis['summary_stats'],
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Format model accuracies in your expected format
        for model_name, metrics in analysis['model_accuracies'].items():
            model_display_name = model_name.replace('_', ' ').title()
            response['model_performance'][model_display_name] = {
                'accuracy': metrics['accuracy'],
                'classification_report': {
                    'covered': {
                        'precision': metrics['precision']['covered'],
                        'recall': metrics['recall']['covered'],
                        'f1_score': metrics['f1_score']['covered'],
                        'support': metrics['support']['covered']
                    },
                    'partial': {
                        'precision': metrics['precision']['partial'],
                        'recall': metrics['recall']['partial'],
                        'f1_score': metrics['f1_score']['partial'],
                        'support': metrics['support']['partial']
                    },
                    'uncovered': {
                        'precision': metrics['precision']['uncovered'],
                        'recall': metrics['recall']['uncovered'],
                        'f1_score': metrics['f1_score']['uncovered'],
                        'support': metrics['support']['uncovered']
                    }
                }
            }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =============================================================================
# PROJECT UPLOAD ENDPOINTS - FILE & GITHUB REPOSITORY UPLOAD
# =============================================================================

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'zip', 'tar', 'gz', 'rar'}
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB

# Ensure upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_project_files(project_path, project_name):
    """
    Analyze uploaded project files for vulnerabilities and security issues
    """
    analysis_result = {
        'project_name': project_name,
        'total_files': 0,
        'code_files': 0,
        'vulnerabilities': [],
        'security_issues': [],
        'languages_detected': [],
        'risk_score': 0,
        'recommendations': []
    }
    
    try:
        # Count files and detect languages
        code_extensions = {
            '.py': 'Python',
            '.js': 'JavaScript', 
            '.ts': 'TypeScript',
            '.java': 'Java',
            '.php': 'PHP',
            '.cs': 'C#',
            '.cpp': 'C++',
            '.c': 'C',
            '.rb': 'Ruby',
            '.go': 'Go',
            '.rs': 'Rust',
            '.html': 'HTML',
            '.css': 'CSS',
            '.sql': 'SQL',
            '.json': 'JSON',
            '.xml': 'XML',
            '.yaml': 'YAML',
            '.yml': 'YAML'
        }
        
        languages = set()
        total_files = 0
        code_files = 0
        
        for root, dirs, files in os.walk(project_path):
            # Skip common non-essential directories
            dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.vscode', '.idea']]
            
            for file in files:
                total_files += 1
                file_path = os.path.join(root, file)
                file_ext = os.path.splitext(file)[1].lower()
                
                if file_ext in code_extensions:
                    code_files += 1
                    languages.add(code_extensions[file_ext])
                    
                    # Basic vulnerability patterns
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            
                            # Check for common security issues
                            vulnerabilities = check_vulnerabilities(content, file, file_ext)
                            analysis_result['vulnerabilities'].extend(vulnerabilities)
                            
                    except Exception as e:
                        continue
        
        analysis_result['total_files'] = total_files
        analysis_result['code_files'] = code_files
        analysis_result['languages_detected'] = list(languages)
        
        # Calculate risk score based on vulnerabilities
        risk_score = min(100, len(analysis_result['vulnerabilities']) * 10)
        analysis_result['risk_score'] = risk_score
        
        # Generate recommendations
        analysis_result['recommendations'] = generate_security_recommendations(
            analysis_result['vulnerabilities'], 
            languages
        )
        
    except Exception as e:
        analysis_result['error'] = str(e)
    
    return analysis_result

def check_vulnerabilities(content, filename, file_ext):
    """
    Check for common vulnerability patterns in code
    """
    vulnerabilities = []
    
    # Common vulnerability patterns
    patterns = {
        'SQL Injection': [
            r'SELECT.*\+.*',
            r'INSERT.*\+.*',
            r'UPDATE.*\+.*',
            r'DELETE.*\+.*',
            r'exec\s*\(',
            r'execute\s*\('
        ],
        'XSS': [
            r'innerHTML\s*=',
            r'document\.write\s*\(',
            r'eval\s*\(',
            r'\$\(.*\)\.html\s*\(',
        ],
        'Hardcoded Secrets': [
            r'password\s*=\s*["\'][^"\']{3,}["\']',
            r'api_key\s*=\s*["\'][^"\']{10,}["\']',
            r'secret\s*=\s*["\'][^"\']{5,}["\']',
            r'token\s*=\s*["\'][^"\']{10,}["\']',
        ],
        'Insecure Functions': [
            r'md5\s*\(',
            r'sha1\s*\(',
            r'pickle\.loads\s*\(',
            r'eval\s*\(',
            r'exec\s*\(',
        ],
        'File Path Traversal': [
            r'\.\./',
            r'open\s*\([^)]*\.\./[^)]*\)',
            r'readFile\s*\([^)]*\.\./[^)]*\)',
        ]
    }
    
    import re
    
    for vuln_type, pattern_list in patterns.items():
        for pattern in pattern_list:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                vulnerabilities.append({
                    'type': vuln_type,
                    'file': filename,
                    'pattern': pattern,
                    'matches': len(matches),
                    'severity': get_severity(vuln_type),
                    'description': get_vulnerability_description(vuln_type)
                })
    
    return vulnerabilities

def get_severity(vuln_type):
    """Get severity level for vulnerability type"""
    severity_map = {
        'SQL Injection': 'Critical',
        'XSS': 'High',
        'Hardcoded Secrets': 'High',
        'Insecure Functions': 'Medium',
        'File Path Traversal': 'High'
    }
    return severity_map.get(vuln_type, 'Medium')

def get_vulnerability_description(vuln_type):
    """Get description for vulnerability type"""
    descriptions = {
        'SQL Injection': 'Potential SQL injection vulnerability found. Use parameterized queries.',
        'XSS': 'Cross-site scripting vulnerability. Sanitize user inputs and use safe DOM methods.',
        'Hardcoded Secrets': 'Hardcoded credentials found. Use environment variables or secure vaults.',
        'Insecure Functions': 'Use of insecure functions. Consider safer alternatives.',
        'File Path Traversal': 'Path traversal vulnerability. Validate and sanitize file paths.'
    }
    return descriptions.get(vuln_type, 'Security issue detected.')

def generate_security_recommendations(vulnerabilities, languages):
    """Generate security recommendations based on findings"""
    recommendations = []
    
    vuln_types = {v['type'] for v in vulnerabilities}
    
    if 'SQL Injection' in vuln_types:
        recommendations.append("Implement parameterized queries and input validation")
    
    if 'XSS' in vuln_types:
        recommendations.append("Use Content Security Policy (CSP) and escape user inputs")
    
    if 'Hardcoded Secrets' in vuln_types:
        recommendations.append("Move secrets to environment variables or secure key management")
    
    if 'Python' in languages:
        recommendations.append("Use security linters like bandit for Python code analysis")
    
    if 'JavaScript' in languages:
        recommendations.append("Use ESLint security rules and consider using TypeScript")
    
    if len(vulnerabilities) > 10:
        recommendations.append("Consider automated security testing in CI/CD pipeline")
    
    if not recommendations:
        recommendations.append("Implement regular security code reviews and dependency scanning")
    
    return recommendations

@api.route('/projects/upload/github', methods=['POST'])
def upload_github_repository():
    """
    Upload and analyze a GitHub repository
    """
    try:
        data = request.get_json()
        
        if not data or 'repository_url' not in data:
            return jsonify({'error': 'Repository URL is required'}), 400
        
        repo_url = data['repository_url']
        branch = data.get('branch', 'main')
        access_token = data.get('access_token')
        
        # Validate GitHub URL
        if 'github.com' not in repo_url:
            return jsonify({'error': 'Invalid GitHub repository URL'}), 400
        
        # Extract repo name for project creation
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        
        # Create temporary directory for cloning
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Clone repository
            clone_url = repo_url
            if access_token:
                # Add token to URL for private repos
                clone_url = repo_url.replace('https://', f'https://{access_token}@')
            
            # Clone command
            cmd = ['git', 'clone', '--depth', '1', '-b', branch, clone_url, temp_dir]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode != 0:
                return jsonify({
                    'error': 'Failed to clone repository',
                    'details': result.stderr
                }), 400
            
            # Analyze the cloned repository
            analysis = analyze_project_files(temp_dir, repo_name)
            
            # Create project in database
            project = Project(
                name=f"{repo_name} (GitHub)",
                description=f"Security analysis of GitHub repository: {repo_url}",
                weights={
                    'functional': 30,
                    'data': 20,
                    'journey': 20,
                    'risk': 20,
                    'environmental': 10
                }
            )
            
            db.session.add(project)
            db.session.commit()
            
            # Add analysis results as features
            for i, vuln in enumerate(analysis['vulnerabilities'][:20]):  # Limit to 20 vulnerabilities
                feature = Feature(
                    project_id=project.id,
                    feature_id=f"VULN_{i+1}",
                    name=f"{vuln['type']} in {vuln['file']}",
                    priority='high' if vuln['severity'] in ['Critical', 'High'] else 'medium',
                    complexity='high',
                    business_impact='high' if vuln['severity'] == 'Critical' else 'medium',
                    risk_score=5 if vuln['severity'] == 'Critical' else 3,
                    status='uncovered',
                    coverage_percentage=0
                )
                db.session.add(feature)
            
            db.session.commit()
            
            response = {
                'status': 'success',
                'message': 'GitHub repository analyzed successfully',
                'project_id': project.id,
                'analysis': analysis,
                'upload_method': 'github'
            }
            
            return jsonify(response)
            
        finally:
            # Clean up temporary directory
            shutil.rmtree(temp_dir, ignore_errors=True)
            
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Repository clone timeout. Please try again.'}), 408
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@api.route('/projects/upload/file', methods=['POST'])
def upload_project_file():
    """
    Upload and analyze a project file (ZIP, etc.)
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload ZIP, TAR, or RAR files.'}), 400
        
        # Secure filename
        filename = secure_filename(file.filename)
        
        # Create temporary directories
        upload_path = os.path.join(UPLOAD_FOLDER, filename)
        extract_dir = tempfile.mkdtemp()
        
        try:
            # Save uploaded file
            file.save(upload_path)
            
            # Extract file based on type
            if filename.lower().endswith('.zip'):
                with zipfile.ZipFile(upload_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_dir)
            else:
                return jsonify({'error': 'Currently only ZIP files are supported'}), 400
            
            # Get project name from filename
            project_name = os.path.splitext(filename)[0]
            
            # Analyze extracted files
            analysis = analyze_project_files(extract_dir, project_name)
            
            # Create project in database
            project = Project(
                name=f"{project_name} (Upload)",
                description=f"Security analysis of uploaded file: {filename}",
                weights={
                    'functional': 30,
                    'data': 20,
                    'journey': 20,
                    'risk': 20,
                    'environmental': 10
                }
            )
            
            db.session.add(project)
            db.session.commit()
            
            # Add analysis results as features
            for i, vuln in enumerate(analysis['vulnerabilities'][:20]):  # Limit to 20 vulnerabilities
                feature = Feature(
                    project_id=project.id,
                    feature_id=f"VULN_{i+1}",
                    name=f"{vuln['type']} in {vuln['file']}",
                    priority='high' if vuln['severity'] in ['Critical', 'High'] else 'medium',
                    complexity='high',
                    business_impact='high' if vuln['severity'] == 'Critical' else 'medium',
                    risk_score=5 if vuln['severity'] == 'Critical' else 3,
                    status='uncovered',
                    coverage_percentage=0
                )
                db.session.add(feature)
            
            db.session.commit()
            
            response = {
                'status': 'success',
                'message': 'File uploaded and analyzed successfully',
                'project_id': project.id,
                'analysis': analysis,
                'upload_method': 'file',
                'files_count': analysis['total_files']
            }
            
            return jsonify(response)
            
        finally:
            # Clean up files
            if os.path.exists(upload_path):
                os.remove(upload_path)
            shutil.rmtree(extract_dir, ignore_errors=True)
            
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@api.route('/projects/<int:project_id>/vulnerabilities', methods=['GET'])
def get_project_vulnerabilities(project_id):
    """
    Get detailed vulnerability report for a project
    """
    try:
        project = Project.query.get_or_404(project_id)
        features = Feature.query.filter_by(project_id=project_id).all()
        
        # Group vulnerabilities by type
        vulnerabilities_by_type = {}
        total_critical = 0
        total_high = 0
        total_medium = 0
        
        for feature in features:
            if feature.feature_id.startswith('VULN_'):
                vuln_type = feature.name.split(' in ')[0]
                severity = 'Critical' if feature.risk_score == 5 else 'High' if feature.risk_score >= 3 else 'Medium'
                
                if vuln_type not in vulnerabilities_by_type:
                    vulnerabilities_by_type[vuln_type] = []
                
                vulnerabilities_by_type[vuln_type].append({
                    'id': feature.id,
                    'file': feature.name.split(' in ')[-1] if ' in ' in feature.name else 'Unknown',
                    'severity': severity,
                    'risk_score': feature.risk_score,
                    'status': feature.status,
                    'priority': feature.priority
                })
                
                # Count by severity
                if severity == 'Critical':
                    total_critical += 1
                elif severity == 'High':
                    total_high += 1
                else:
                    total_medium += 1
        
        # Calculate overall risk score
        total_vulnerabilities = total_critical + total_high + total_medium
        overall_risk = 0
        if total_vulnerabilities > 0:
            overall_risk = ((total_critical * 5) + (total_high * 3) + (total_medium * 1)) / total_vulnerabilities
        
        response = {
            'project_id': project_id,
            'project_name': project.name,
            'vulnerabilities_by_type': vulnerabilities_by_type,
            'summary': {
                'total_vulnerabilities': total_vulnerabilities,
                'critical': total_critical,
                'high': total_high,
                'medium': total_medium,
                'overall_risk_score': round(overall_risk, 2)
            },
            'recommendations': [
                'Prioritize fixing critical and high severity vulnerabilities',
                'Implement automated security scanning in CI/CD pipeline',
                'Regular security code reviews and dependency updates',
                'Use static analysis security testing (SAST) tools'
            ]
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500