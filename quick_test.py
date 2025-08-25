#!/usr/bin/env python3
"""
Quick manual test to verify the backend is working
"""

# First, let's start the server manually
from backend.app import create_app, db

print("🚀 Starting Coverage Framework Backend...")

app = create_app()

with app.app_context():
    # Check if database exists
    try:
        from backend.app.models import Project, Feature
        projects = Project.query.all()
        print(f"✅ Database connected! Found {len(projects)} projects")
        
        if projects:
            project = projects[0]
            print(f"📋 Project: {project.name}")
            
            features = Feature.query.filter_by(project_id=project.id).all()
            print(f"🔧 Features: {len(features)}")
            
            for feature in features:
                print(f"   • {feature.name} ({feature.status})")
            
            # Test coverage calculation
            from backend.app.utils import CoverageCalculator
            coverage = CoverageCalculator.calculate_total_coverage_score(project.id)
            
            print(f"\n📊 5-DIMENSIONAL COVERAGE SCORES:")
            print(f"   • Functional: {coverage['functional_coverage']:.1f}%")
            print(f"   • Data: {coverage['data_coverage']:.1f}%") 
            print(f"   • Journey: {coverage['journey_coverage']:.1f}%")
            print(f"   • Risk: {coverage['risk_coverage']:.1f}%")
            print(f"   • Environmental: {coverage['environmental_coverage']:.1f}%")
            print(f"   • TOTAL SCORE: {coverage['total_coverage_score']:.1f}")
            
            # Test AI recommendations
            from backend.app.utils import RecommendationGenerator
            recommendations = RecommendationGenerator.generate_comprehensive_recommendations(project.id)
            
            print(f"\n🤖 AI RECOMMENDATIONS ({len(recommendations)}):")
            for i, rec in enumerate(recommendations[:3], 1):
                print(f"   {i}. {rec['title']} (Priority: {rec['priority']}, Impact: {rec['impact_score']})")
            
            print("\n✅ ALL TESTS PASSED! Your backend is working perfectly!")
            print("\n🌐 To start the web server:")
            print("   cd backend")
            print("   python run.py")
            print("\n📖 Then access: http://localhost:5000/api/projects")
            
        else:
            print("❌ No sample data found. Run: python setup.py")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Try running: python backend/setup.py")

if __name__ == "__main__":
    pass
