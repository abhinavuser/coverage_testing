import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def generate_ai_recommendations(features_data):
    feature_matrix = []
    for feature in features_data:
        priority = {'high': 3, 'medium': 2, 'low': 1}[feature['priority']]
        coverage = {'covered': 3, 'partial': 2, 'uncovered': 1}[feature['status']]
        risk = feature['risk_score']
        complexity = feature['complexity_score']
        feature_matrix.append([priority, coverage, risk, complexity])
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(feature_matrix)
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(scaled_features)
    recommendations = []
    for i, cluster in enumerate(clusters):
        if feature_matrix[i][0] >= 2 and feature_matrix[i][1] <= 2 and feature_matrix[i][2] >= 3:
            recommendations.append({
                'priority': 1,
                'feature': features_data[i]['name'],
                'reason': 'AI identified high-risk coverage gap',
                'impact_score': feature_matrix[i][0] * feature_matrix[i][2] * 10
            })
    return sorted(recommendations, key=lambda x: x['impact_score'], reverse=True)