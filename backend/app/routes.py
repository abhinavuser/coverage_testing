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