#!/usr/bin/env python3
"""
Startup Script for Complete Workflow
Sets up environment and starts the coverage analysis workflow
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
API_KEY = os.getenv('HUGGINGFACE_API_KEY')
if not API_KEY:
    print("❌ HUGGINGFACE_API_KEY not found in environment variables!")
    print("Please create a .env file with your API key")
    print("The .env file should contain: HUGGINGFACE_API_KEY=your_key_here")
    exit(1)

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'flask', 'pandas', 'requests', 'gitpython', 
        'scikit-learn', 'xgboost', 'numpy'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"  ❌ {package} - MISSING")
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
            print("✅ Dependencies installed successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies. Please run:")
            print("pip install -r backend/requirements.txt")
            return False
    
    return True

def check_api_key():
    """Test the Hugging Face API key"""
    print("\n🔑 Testing API key...")
    
    try:
        # Test API key with a simple request to a working model
        headers = {"Authorization": f"Bearer {API_KEY}"}
        response = requests.get(
            "https://api-inference.huggingface.co/models/gpt2",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ API key is valid!")
            return True
        elif response.status_code == 404:
            # Model not found, but API key is working
            print("✅ API key is valid! (Model not found, but API responded)")
            return True
        else:
            print(f"❌ API key test failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API key test failed: {str(e)}")
        return False

def start_flask_app():
    """Start the Flask application"""
    print("\n🚀 Starting Flask application...")
    
    # Change to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    os.chdir(backend_dir)
    
    try:
        # Start Flask app in background
        process = subprocess.Popen([
            sys.executable, 'app.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for app to start
        print("⏳ Waiting for Flask app to start...")
        time.sleep(5)
        
        # Test if app is running
        try:
            response = requests.get("http://localhost:5000/api/projects", timeout=5)
            if response.status_code == 200:
                print("✅ Flask app is running on http://localhost:5000")
                return process
            else:
                print(f"❌ Flask app test failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException:
            print("❌ Flask app is not responding")
            return False
            
    except Exception as e:
        print(f"❌ Failed to start Flask app: {str(e)}")
        return False

def run_tests():
    """Run the complete workflow tests"""
    print("\n🧪 Running complete workflow tests...")
    
    # Change back to root directory
    os.chdir("..")
    
    try:
        # Run the test script
        result = subprocess.run([
            sys.executable, 'test_complete_workflow.py'
        ], capture_output=True, text=True)
        
        print("Test Output:")
        print(result.stdout)
        
        if result.stderr:
            print("Errors:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("✅ All tests completed successfully!")
            return True
        else:
            print("❌ Some tests failed")
            return False
            
    except Exception as e:
        print(f"❌ Failed to run tests: {str(e)}")
        return False

def main():
    """Main startup function"""
    print("🚀 Complete Workflow Startup")
    print("=" * 60)
    print(f"🔑 API Key: {API_KEY[:10]}...")
    print("=" * 60)
    print("📋 This script will:")
    print("1. ✅ Check if all required packages are installed")
    print("2. ✅ Test your Hugging Face API key")
    print("3. ✅ Start the Flask application")
    print("4. ✅ Run comprehensive tests")
    print("5. ✅ Show you all available endpoints")
    print("=" * 60)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        print("❌ Dependency check failed. Exiting.")
        return
    
    # Step 2: Test API key
    if not check_api_key():
        print("❌ API key test failed. Exiting.")
        return
    
    # Step 3: Start Flask app
    flask_process = start_flask_app()
    if not flask_process:
        print("❌ Failed to start Flask app. Exiting.")
        return
    
    try:
        # Step 4: Run tests
        if run_tests():
            print("\n🎉 Complete workflow is ready!")
            print("\n📋 Available endpoints:")
            print("  - POST http://localhost:5000/api/coverage/github")
            print("  - POST http://localhost:5000/api/coverage/upload")
            print("  - POST http://localhost:5000/api/coverage/docker-compose")
            print("  - POST http://localhost:5000/api/coverage/analyze")
            print("  - GET  http://localhost:5000/api/coverage/risk-areas")
            print("  - GET  http://localhost:5000/api/coverage/clusters")
            print("  - GET  http://localhost:5000/api/coverage/recommendations")
            
            print("\n🔧 Next steps:")
            print("1. Integrate with your frontend")
            print("2. Customize LLM prompts if needed")
            print("3. Monitor analysis results")
            print("4. Scale up for production use")
            
            print("\n⏹️  Press Ctrl+C to stop the Flask app...")
            
            # Keep the app running
            try:
                flask_process.wait()
            except KeyboardInterrupt:
                print("\n🛑 Stopping Flask app...")
                flask_process.terminate()
                flask_process.wait()
                print("✅ Flask app stopped.")
                
        else:
            print("❌ Tests failed. Check the output above.")
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping Flask app...")
        flask_process.terminate()
        flask_process.wait()
        print("✅ Flask app stopped.")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        flask_process.terminate()
        flask_process.wait()

if __name__ == "__main__":
    main()
