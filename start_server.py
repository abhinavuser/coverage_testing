#!/usr/bin/env python3
"""
Simple server startup script for the Coverage Framework
"""
import os
import sys

# Add the backend directory to the path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change to backend directory
os.chdir(backend_path)

# Import and run the app
from app import create_app, db

app = create_app()

if __name__ == "__main__":
    print("🚀 Starting Coverage Framework Backend...")
    print("📊 Loading ML models (PKL files)...")
    
    with app.app_context():
        try:
            # Create database tables if they don't exist
            db.create_all()
            print("✅ Database initialized successfully")
        except Exception as e:
            print(f"⚠️ Database warning: {e}")
    
    print("\n🎯 API Endpoints Ready:")
    print("   • GET  http://localhost:5000/api/coverage/overall")
    print("   • GET  http://localhost:5000/api/coverage/risk-areas")
    print("   • GET  http://localhost:5000/api/coverage/clusters")
    print("   • GET  http://localhost:5000/api/coverage/recommendations")
    print("   • GET  http://localhost:5000/api/ml/models/info")
    print("   • POST http://localhost:5000/api/ml/predict/risk")
    print("   • GET  http://localhost:5000/api/ml/comprehensive-analysis")
    print("\n🔥 Server starting on http://localhost:5000")
    print("📡 Ready for Postman testing!")
    print("\n" + "="*60)
    
    # Start the server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False  # Disable reloader to avoid issues
    )

