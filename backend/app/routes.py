from flask import Blueprint, request, jsonify
from .models import Feature, db
from .ml_engine import generate_ai_recommendations

api = Blueprint('api', __name__)

@api.route('/features', methods=['GET'])
def get_features():
    features = Feature.query.all()
    return jsonify([{
        'id': f.id,
        'name': f.name,
        'priority': f.priority,
        'risk_score': f.risk_score,
        'complexity_score': f.complexity_score,
        'status': f.status
    } for f in features])

@api.route('/features', methods=['POST'])
def add_feature():
    data = request.json
    feature = Feature(**data)
    db.session.add(feature)
    db.session.commit()
    return jsonify({'message': 'Feature added'}), 201

@api.route('/coverage', methods=['GET'])
def get_coverage():
    features = Feature.query.all()
    total = len(features)
    covered = sum(1 for f in features if f.status == 'covered')
    partial = sum(1 for f in features if f.status == 'partial')
    uncovered = sum(1 for f in features if f.status == 'uncovered')
    return jsonify({
        'total': total,
        'covered': covered,
        'partial': partial,
        'uncovered': uncovered,
        'coverage_percent': round(covered / total * 100, 2) if total else 0
    })

@api.route('/recommendations', methods=['GET'])
def recommendations():
    features = Feature.query.all()
    features_data = [{
        'name': f.name,
        'priority': f.priority,
        'risk_score': f.risk_score,
        'complexity_score': f.complexity_score,
        'status': f.status
    } for f in features]
    recs = generate_ai_recommendations(features_data)
    return jsonify(recs)