"""
Setup script for the Coverage Testing Framework backend
"""

from app import create_app, db
from app.models import *  # Import all models
import sys

def setup_database():
    """Initialize database with tables"""
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Create a default project for testing
            if not Project.query.first():
                default_project = Project(
                    name="Sample Coverage Project",
                    description="Default project for testing the coverage framework",
                    functional_weight=0.25,
                    data_weight=0.20,
                    journey_weight=0.25,
                    risk_weight=0.20,
                    environmental_weight=0.10
                )
                db.session.add(default_project)
                
                # Add sample features
                sample_features = [
                    Feature(
                        project_id=1,
                        feature_id="AUTH-001",
                        name="User Authentication",
                        description="Login and registration functionality",
                        priority="high",
                        complexity="medium",
                        business_impact="critical",
                        risk_score=4,
                        status="partial"
                    ),
                    Feature(
                        project_id=1,
                        feature_id="PAY-001", 
                        name="Payment Processing",
                        description="Credit card and payment gateway integration",
                        priority="high",
                        complexity="high",
                        business_impact="critical",
                        risk_score=5,
                        status="uncovered"
                    ),
                    Feature(
                        project_id=1,
                        feature_id="PROF-001",
                        name="User Profile Management",
                        description="Profile creation and updates",
                        priority="medium",
                        complexity="low",
                        business_impact="medium",
                        risk_score=2,
                        status="covered"
                    )
                ]
                
                for feature in sample_features:
                    db.session.add(feature)
                
                db.session.commit()
                print("✅ Sample data created successfully!")
            
            print("\n🚀 Setup completed! You can now start the application.")
            print("Run: python run.py")
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            sys.exit(1)

if __name__ == "__main__":
    setup_database()
