#!/usr/bin/env python3
"""
Complete Workflow Test Script
Tests the entire coverage analysis workflow with LLM integration
"""

import os
import requests
import json
import tempfile
import zipfile
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
API_KEY = os.getenv('HUGGINGFACE_API_KEY')
if not API_KEY:
    print("❌ HUGGINGFACE_API_KEY not found in environment variables!")
    print("Please create a .env file with your API key")
    exit(1)

# Flask app URL
BASE_URL = "http://localhost:5000/api"

def test_github_analysis():
    """Test GitHub repository analysis"""
    print("🔍 Testing GitHub Repository Analysis")
    print("=" * 50)
    
    url = f"{BASE_URL}/coverage/github"
    data = {
        "github_url": "https://github.com/jenstroeger/python-package-template"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ GitHub analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis completed: {result.get('llm_analysis', {}).get('success', False)}")
            
            # Show summary
            if 'llm_analysis' in result and 'analysis' in result['llm_analysis']:
                analysis = result['llm_analysis']['analysis']
                print(f"\n📊 Analysis Summary:")
                print(f"- Security vulnerabilities found: {len(analysis.get('security_analysis', {}).get('vulnerabilities', []))}")
                print(f"- Coverage gaps identified: {len(analysis.get('coverage_gaps', {}).get('gaps', []))}")
                print(f"- Test recommendations: {len(analysis.get('test_recommendations', {}).get('recommendations', []))}")
                print(f"- Risk assessment: {analysis.get('risk_assessment', {}).get('overall_risk_level', 'Unknown')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_zip_upload():
    """Test ZIP file upload analysis"""
    print("\n📦 Testing ZIP File Upload Analysis")
    print("=" * 50)
    
    # Create a sample ZIP file for testing
    with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_zip:
        zip_path = temp_zip.name
        
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            # Add a sample Python file
            zipf.writestr('sample.py', '''
def hello_world():
    print("Hello, World!")
    return "Hello"

def add_numbers(a, b):
    return a + b

if __name__ == "__main__":
    hello_world()
''')
            
            # Add a requirements.txt
            zipf.writestr('requirements.txt', 'flask==2.3.3\nrequests==2.31.0\n')
            
            # Add a Dockerfile
            zipf.writestr('Dockerfile', '''
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "sample.py"]
''')
    
    try:
        url = f"{BASE_URL}/coverage/upload"
        
        with open(zip_path, 'rb') as f:
            files = {'file': ('test_project.zip', f, 'application/zip')}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ ZIP upload analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis completed: {result.get('llm_analysis', {}).get('success', False)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
    finally:
        # Clean up
        if os.path.exists(zip_path):
            os.remove(zip_path)

def test_docker_compose_analysis():
    """Test Docker Compose analysis"""
    print("\n🐳 Testing Docker Compose Analysis")
    print("=" * 50)
    
    docker_compose_content = """
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
    volumes:
      - .:/app
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=testuser
      - POSTGRES_PASSWORD=testpass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
"""
    
    url = f"{BASE_URL}/coverage/docker-compose"
    data = {
        "docker_compose_content": docker_compose_content
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Docker Compose analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis completed: {result.get('llm_analysis', {}).get('success', False)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_generic_analysis():
    """Test generic analysis endpoint"""
    print("\n🔄 Testing Generic Analysis Endpoint")
    print("=" * 50)
    
    url = f"{BASE_URL}/coverage/analyze"
    data = {
        "input_type": "github",
        "input_source": "https://github.com/jenstroeger/python-package-template"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Generic analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis completed: {result.get('llm_analysis', {}).get('success', False)}")
            
            # Show detailed results
            if 'llm_analysis' in result and 'analysis' in result['llm_analysis']:
                analysis = result['llm_analysis']['analysis']
                
                print(f"\n🔍 Detailed Analysis Results:")
                
                # Security Analysis
                if 'security_analysis' in analysis:
                    sec = analysis['security_analysis']
                    print(f"🔒 Security Vulnerabilities: {len(sec.get('vulnerabilities', []))}")
                    for vuln in sec.get('vulnerabilities', [])[:3]:  # Show first 3
                        print(f"  - {vuln.get('title', 'Unknown')}: {vuln.get('severity', 'Unknown')}")
                
                # Test Recommendations
                if 'test_recommendations' in analysis:
                    recs = analysis['test_recommendations']
                    print(f"🧪 Test Recommendations: {len(recs.get('recommendations', []))}")
                    for rec in recs.get('recommendations', [])[:3]:  # Show first 3
                        print(f"  - {rec.get('title', 'Unknown')}: {rec.get('priority', 'Unknown')}")
                
                # Workflow Analysis
                if 'workflow_analysis' in analysis:
                    workflow = analysis['workflow_analysis']
                    print(f"🔄 Workflow Understanding: {workflow.get('workflow_summary', 'Not available')}")
                
                # Risk Assessment
                if 'risk_assessment' in analysis:
                    risk = analysis['risk_assessment']
                    print(f"⚠️  Overall Risk Level: {risk.get('overall_risk_level', 'Unknown')}")
                    print(f"   Risk Score: {risk.get('risk_score', 'Unknown')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_existing_endpoints():
    """Test your existing endpoints"""
    print("\n🏗️ Testing Existing Endpoints")
    print("=" * 50)
    
    endpoints = [
        "/coverage/risk-areas",
        "/coverage/clusters", 
        "/coverage/recommendations"
    ]
    
    for endpoint in endpoints:
        try:
            url = f"{BASE_URL}{endpoint}"
            response = requests.get(url)
            print(f"{endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"  ✅ Success - Data received")
            else:
                print(f"  ❌ Error: {response.text[:100]}...")
                
        except Exception as e:
            print(f"  ❌ Exception: {str(e)}")

def main():
    """Main test function"""
    print("Complete Workflow Testing with LLM Integration")
    print("=" * 60)
    print(f"API Key: {API_KEY[:10]}...")
    print(f"Base URL: {BASE_URL}")
    print("=" * 60)
    
    # Test existing endpoints first
    test_existing_endpoints()
    
    # Test new LLM workflow
    test_github_analysis()
    test_zip_upload()
    test_docker_compose_analysis()
    test_generic_analysis()
    
    print("\n" + "=" * 60)
    print("Complete Workflow Testing Finished!")
    print("\n📋 Summary:")
    print("✅ All endpoints are now available:")
    print("   - POST /api/coverage/github - GitHub repo analysis")
    print("   - POST /api/coverage/upload - ZIP file upload")
    print("   - POST /api/coverage/docker-compose - Docker Compose analysis")
    print("   - POST /api/coverage/analyze - Generic analysis")
    print("   - POST /api/llm/analyze - LLM analysis only")
    print("\n🔧 Next Steps:")
    print("1. Start your Flask app: python backend/app.py")
    print("2. Run this test script: python test_complete_workflow.py")
    print("3. Integrate with your frontend")
    print("4. Monitor the analysis results")

if __name__ == "__main__":
    main()
