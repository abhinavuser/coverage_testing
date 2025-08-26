#!/usr/bin/env python3
"""
Test All Input Methods - GitHub, ZIP, Docker Compose
"""

import requests
import tempfile
import zipfile
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:5000/api"

def test_github_input():
    """Test GitHub repository input"""
    print("🔍 Testing GitHub Repository Input")
    print("=" * 50)
    
    url = f"{BASE_URL}/coverage/github"
    data = {
        "github_url": "https://github.com/jenstroeger/python-package-template"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ GitHub analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis: {result.get('llm_analysis', {}).get('success', False)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def test_zip_input():
    """Test ZIP file input"""
    print("\n📦 Testing ZIP File Input")
    print("=" * 50)
    
    # Create a sample ZIP file
    with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_zip:
        zip_path = temp_zip.name
        
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            # Add sample files
            zipf.writestr('main.py', '''
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    print(hello())
''')
            zipf.writestr('requirements.txt', 'flask==2.3.3\nrequests==2.31.0\n')
            zipf.writestr('Dockerfile', '''
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
''')
    
    try:
        url = f"{BASE_URL}/coverage/upload"
        
        with open(zip_path, 'rb') as f:
            files = {'file': ('test_project.zip', f, 'application/zip')}
            response = requests.post(url, files=files)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ ZIP analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis: {result.get('llm_analysis', {}).get('success', False)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
    finally:
        # Clean up
        if os.path.exists(zip_path):
            os.remove(zip_path)

def test_docker_compose_input():
    """Test Docker Compose input"""
    print("\n🐳 Testing Docker Compose Input")
    print("=" * 50)
    
    url = f"{BASE_URL}/coverage/docker-compose"
    docker_content = """
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
    
    data = {
        "docker_compose_content": docker_content
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Docker Compose analysis successful!")
            print(f"Dataset generated: {result.get('dataset_generation', {}).get('success', False)}")
            print(f"LLM analysis: {result.get('llm_analysis', {}).get('success', False)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

def main():
    """Main test function"""
    print("🚀 Testing All Input Methods")
    print("=" * 60)
    print("This script will test all 3 ways to give input:")
    print("1. GitHub repository URL")
    print("2. ZIP file upload")
    print("3. Docker Compose content")
    print("=" * 60)
    
    # Test all methods
    test_github_input()
    test_zip_input()
    test_docker_compose_input()
    
    print("\n" + "=" * 60)
    print("🎉 All input methods tested!")
    print("\n📋 Summary:")
    print("✅ GitHub: Just provide a public repository URL")
    print("✅ ZIP: Upload your project as a ZIP file")
    print("✅ Docker Compose: Paste your docker-compose.yml content")
    print("\n🔧 Next: Use any of these methods with your own projects!")

if __name__ == "__main__":
    main()
