# 📁 How to Give Input to Your Coverage Analysis System

## 🎯 **3 Ways to Provide Input**

### **Method 1: GitHub Repository URL**
```bash
# Using curl
curl -X POST http://localhost:5000/api/coverage/github \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/jenstroeger/python-package-template"}'

# Using Python requests
import requests
response = requests.post('http://localhost:5000/api/coverage/github', 
  json={'github_url': 'https://github.com/jenstroeger/python-package-template'})
```

### **Method 2: ZIP File Upload**
```bash
# Using curl
curl -X POST http://localhost:5000/api/coverage/upload \
  -F "file=@your_project.zip"

# Using Python requests
import requests
with open('your_project.zip', 'rb') as f:
    files = {'file': ('project.zip', f, 'application/zip')}
    response = requests.post('http://localhost:5000/api/coverage/upload', files=files)
```

### **Method 3: Docker Compose Content**
```bash
# Using curl
curl -X POST http://localhost:5000/api/coverage/docker-compose \
  -H "Content-Type: application/json" \
  -d '{
    "docker_compose_content": "version: \"3.8\"\nservices:\n  web:\n    build: .\n    ports:\n      - \"5000:5000\""
  }'

# Using Python requests
import requests
docker_content = """
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
"""
response = requests.post('http://localhost:5000/api/coverage/docker-compose', 
  json={'docker_compose_content': docker_content})
```

## 🚀 **Quick Start Examples**

### **Example 1: Analyze a GitHub Repository**
```python
import requests

# Analyze a public GitHub repo
url = "http://localhost:5000/api/coverage/github"
data = {
    "github_url": "https://github.com/jenstroeger/python-package-template"
}

response = requests.post(url, json=data)
result = response.json()
print("Analysis complete:", result['success'])
```

### **Example 2: Upload Your Own ZIP File**
```python
import requests

# Upload your project as ZIP
url = "http://localhost:5000/api/coverage/upload"
with open('my_project.zip', 'rb') as f:
    files = {'file': ('my_project.zip', f, 'application/zip')}
    response = requests.post(url, files=files)
    result = response.json()
    print("Analysis complete:", result['success'])
```

### **Example 3: Analyze Docker Compose**
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
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=testdb
"""

data = {"docker_compose_content": docker_content}
response = requests.post(url, json=data)
result = response.json()
print("Analysis complete:", result['success'])
```

## 📋 **What Happens When You Give Input**

1. **Input Processing**: System accepts your input (GitHub URL, ZIP file, or Docker Compose)
2. **Dataset Generation**: Creates a structured coverage dataset
3. **LLM Analysis**: Performs security, testing, and risk analysis
4. **Results**: Returns comprehensive analysis and recommendations

## 🎯 **Expected Response Format**

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
      "security_analysis": {...},
      "test_recommendations": {...},
      "risk_assessment": {...},
      "workflow_analysis": {...}
    }
  }
}
```

## 🔧 **Setup Steps**

1. **Create .env file** (see env_template.txt)
2. **Start the system**: `python start_workflow.py`
3. **Give input** using any of the 3 methods above
4. **Get results** with comprehensive analysis

## 📞 **Need Help?**

- Check if Flask app is running: `http://localhost:5000/api/projects`
- Test API key: `python quick_test.py`
- See what startup does: `python what_startup_does.py`
