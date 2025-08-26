# 🚀 Complete Setup Guide

## 🔑 **Step 1: Create .env File**

Create a file named `.env` (with the dot) in your project root directory:

```bash
# Copy this content to a file named ".env" in your project root

# Hugging Face API Key for LLM Integration
HUGGINGFACE_API_KEY=

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_RUN_PORT=5000

# Database Configuration (if needed)
DATABASE_URL=sqlite:///app.db
```

**Important:**
- ✅ Save as `.env` (with the dot) in your project root
- ✅ Never commit this file to git
- ✅ The `.gitignore` already excludes `.env` files

## 🚀 **Step 2: Start the System**

```bash
# Run the startup script
python start_workflow.py
```

This will:
1. ✅ Check dependencies
2. ✅ Test your API key
3. ✅ Start Flask app
4. ✅ Run comprehensive tests
5. ✅ Show all available endpoints

## 📁 **Step 3: Give Input (3 Ways)**

### **Method 1: GitHub Repository**
```python
import requests

# Analyze any public GitHub repository
url = "http://localhost:5000/api/coverage/github"
data = {
    "github_url": "https://github.com/jenstroeger/python-package-template"
}

response = requests.post(url, json=data)
result = response.json()
print("Analysis complete:", result['success'])
```

### **Method 2: ZIP File Upload**
```python
import requests

# Upload your project as ZIP file
url = "http://localhost:5000/api/coverage/upload"
with open('my_project.zip', 'rb') as f:
    files = {'file': ('my_project.zip', f, 'application/zip')}
    response = requests.post(url, files=files)
    result = response.json()
    print("Analysis complete:", result['success'])
```

### **Method 3: Docker Compose**
```python
import requests

# Analyze Docker Compose content
url = "http://localhost:5000/api/coverage/docker-compose"
docker_content = """
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
"""

data = {"docker_compose_content": docker_content}
response = requests.post(url, json=data)
result = response.json()
print("Analysis complete:", result['success'])
```

## 🧪 **Step 4: Test Everything**

```bash
# Test API key and basic setup
python quick_test.py

# Test all input methods
python test_input_methods.py

# See what the startup does
python what_startup_does.py
```

## 📊 **What You Get Back**

When you give input, you get comprehensive analysis:

```json
{
  "success": true,
  "dataset_generation": {
    "success": true,
    "dataset_path": "/tmp/coverage_dataset.csv",
    "metadata": {...}
  },
  "llm_analysis": {
    "success": true,
    "analysis": {
      "security_analysis": {
        "vulnerabilities": [...],
        "security_score": 3.2
      },
      "test_recommendations": {
        "recommendations": [...],
        "test_cases": [...]
      },
      "risk_assessment": {
        "overall_risk_level": "Medium",
        "risk_score": 2.8
      },
      "workflow_analysis": {
        "workflow_summary": "..."
      },
      "endpoint_analysis": {
        "endpoints": [...],
        "security_issues": [...]
      }
    }
  }
}
```

## 🎯 **Available Endpoints**

Once running, you have these endpoints:

- `POST /api/coverage/github` - Analyze GitHub repos
- `POST /api/coverage/upload` - Upload ZIP files
- `POST /api/coverage/docker-compose` - Analyze Docker Compose
- `POST /api/coverage/analyze` - Generic analysis
- `GET /api/coverage/risk-areas` - Get risk areas
- `GET /api/coverage/clusters` - Get ML clusters
- `GET /api/coverage/recommendations` - Get recommendations

## 🔧 **Troubleshooting**

### **API Key Issues**
```bash
# Check if API key is loaded
python quick_test.py
```

### **Dependencies Missing**
```bash
# Install dependencies
pip install -r backend/requirements.txt
```

### **Flask App Not Starting**
```bash
# Check if port 5000 is available
netstat -an | grep 5000
```

## 🎉 **You're Ready!**

1. ✅ API key is secure in `.env` file
2. ✅ System accepts 3 types of input
3. ✅ Complete LLM analysis workflow
4. ✅ All endpoints working
5. ✅ Ready for production use

**Just run `python start_workflow.py` and start analyzing!** 🚀
