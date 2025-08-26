# Complete Workflow Guide: Coverage Analysis with LLM Integration

## 🎯 Overview

This guide explains the complete workflow from input (GitHub repo, ZIP file, or Docker Compose) to LLM analysis and test case generation. The system integrates your existing coverage analysis with advanced LLM capabilities.

## 🔑 API Key Setup

Your Hugging Face API key is already configured:
```
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
```

## 📋 Complete Workflow Steps

### Step 1: Input Processing
The system accepts three types of input:

#### 1.1 GitHub Repository
```bash
POST /api/coverage/github
{
    "github_url": "https://github.com/jenstroeger/python-package-template"
}
```

#### 1.2 ZIP File Upload
```bash
POST /api/coverage/upload
# Multipart form with ZIP file
```

#### 1.3 Docker Compose Content
```bash
POST /api/coverage/docker-compose
{
    "docker_compose_content": "version: '3.8'..."
}
```

### Step 2: Dataset Generation
The `CoverageDatasetGenerator` processes the input and creates a structured dataset:

1. **GitHub**: Clones the repository
2. **ZIP**: Extracts the archive
3. **Docker Compose**: Creates a temporary project structure

The generator analyzes:
- Dockerfiles for security issues
- Dependency manifests for vulnerabilities
- Code modules for complexity and coverage
- Test files for existing coverage

**Output**: CSV dataset with columns:
- `name`: Artifact name
- `module`: Module/component
- `priority`: high/medium/low
- `risk_score`: 1-5 scale
- `complexity_score`: 1-5 scale
- `status`: covered/partial/uncovered
- `business_impact`: Critical/High/Medium/Low

### Step 3: LLM Analysis
The `LLMAnalyzer` processes the dataset using Hugging Face API:

#### 3.1 Security Analysis
- Identifies vulnerabilities in code
- Analyzes Dockerfile security issues
- Checks for dependency vulnerabilities
- Detects authentication/authorization gaps

#### 3.2 Coverage Gap Analysis
- Identifies untested components
- Analyzes test coverage patterns
- Suggests priority areas for testing

#### 3.3 Test Recommendations
- Generates specific test cases
- Prioritizes testing efforts
- Suggests test strategies

#### 3.4 Risk Assessment
- Calculates overall risk level
- Identifies high-risk components
- Provides risk mitigation strategies

#### 3.5 Workflow Analysis
- Understands application architecture
- Maps data flows
- Identifies critical paths

#### 3.6 Endpoint Analysis
- Discovers API endpoints
- Analyzes endpoint security
- Suggests endpoint testing

### Step 4: Model Training (Optional)
The system can train ML models on the generated dataset:

- **Decision Tree**: Fast classification
- **Random Forest**: Robust predictions
- **XGBoost**: High-performance boosting
- **K-Means**: Clustering analysis

### Step 5: Results Integration
Results are integrated with your existing endpoints:

- `/api/coverage/risk-areas`: Enhanced with LLM insights
- `/api/coverage/clusters`: ML-powered clustering
- `/api/coverage/recommendations`: LLM-generated recommendations

## 🚀 API Endpoints

### New LLM-Powered Endpoints

#### 1. Complete Analysis Workflow
```bash
POST /api/coverage/analyze
{
    "input_type": "github|zip|docker_compose",
    "input_source": "URL|file_path|content"
}
```

#### 2. GitHub Repository Analysis
```bash
POST /api/coverage/github
{
    "github_url": "https://github.com/user/repo"
}
```

#### 3. ZIP File Upload
```bash
POST /api/coverage/upload
# Multipart form with ZIP file
```

#### 4. Docker Compose Analysis
```bash
POST /api/coverage/docker-compose
{
    "docker_compose_content": "version: '3.8'..."
}
```

#### 5. LLM Analysis Only
```bash
POST /api/llm/analyze
{
    "dataset_path": "/path/to/dataset.csv",
    "project_metadata": {...}
}
```

### Existing Enhanced Endpoints

#### 1. Risk Areas
```bash
GET /api/coverage/risk-areas
# Now includes LLM-generated security insights
```

#### 2. Clusters
```bash
GET /api/coverage/clusters
# Now includes ML-powered clustering
```

#### 3. Recommendations
```bash
GET /api/coverage/recommendations
# Now includes LLM-generated test recommendations
```

## 📊 Response Format

### Complete Analysis Response
```json
{
    "success": true,
    "dataset_generation": {
        "success": true,
        "dataset_path": "/tmp/coverage_dataset.csv",
        "repo_path": "/tmp/repo",
        "metadata": {...}
    },
    "llm_analysis": {
        "success": true,
        "analysis": {
            "security_analysis": {
                "vulnerabilities": [...],
                "security_score": 3.2,
                "critical_issues": [...]
            },
            "coverage_gaps": {
                "gaps": [...],
                "uncovered_modules": [...],
                "priority_areas": [...]
            },
            "test_recommendations": {
                "recommendations": [...],
                "test_cases": [...],
                "priority_order": [...]
            },
            "risk_assessment": {
                "overall_risk_level": "Medium",
                "risk_score": 2.8,
                "high_risk_components": [...]
            },
            "workflow_analysis": {
                "workflow_summary": "...",
                "data_flows": [...],
                "critical_paths": [...]
            },
            "endpoint_analysis": {
                "endpoints": [...],
                "security_issues": [...],
                "testing_priorities": [...]
            },
            "summary": {
                "total_artifacts": 15,
                "security_issues": 8,
                "coverage_gaps": 12,
                "recommendations": 25
            }
        },
        "dataset_stats": {...},
        "timestamp": "2024-01-01T12:00:00Z"
    },
    "workflow_summary": {
        "input_type": "github",
        "input_source": "https://github.com/user/repo",
        "dataset_created": true,
        "llm_analysis_completed": true,
        "timestamp": "2024-01-01T12:00:00Z"
    }
}
```

## 🧪 Testing the Workflow

### 1. Start the Flask App
```bash
cd backend
python app.py
```

### 2. Run the Test Script
```bash
python test_complete_workflow.py
```

### 3. Manual Testing with curl

#### GitHub Analysis
```bash
curl -X POST http://localhost:5000/api/coverage/github \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/jenstroeger/python-package-template"}'
```

#### ZIP Upload
```bash
curl -X POST http://localhost:5000/api/coverage/upload \
  -F "file=@your_project.zip"
```

#### Docker Compose
```bash
curl -X POST http://localhost:5000/api/coverage/docker-compose \
  -H "Content-Type: application/json" \
  -d '{"docker_compose_content": "version: \"3.8\"..."}'
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
HUGGINGFACE_API_KEY=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

# Optional
FLASK_ENV=development
FLASK_DEBUG=1
```

### Dependencies
All required dependencies are in `backend/requirements.txt`:
- `gitpython`: GitHub repository cloning
- `requests`: API calls
- `pandas`: Data processing
- `scikit-learn`: ML models
- `xgboost`: Advanced ML
- `flask`: Web framework

## 📈 Workflow Benefits

### 1. Automated Analysis
- No manual code review needed
- Consistent analysis across projects
- Scalable to multiple repositories

### 2. Comprehensive Coverage
- Security vulnerability detection
- Test coverage gap analysis
- Risk assessment and prioritization

### 3. Actionable Insights
- Specific test case recommendations
- Prioritized testing efforts
- Security improvement suggestions

### 4. Integration Ready
- Works with existing endpoints
- Extensible architecture
- API-first design

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Issues
```bash
# Check if API key is set
echo $HUGGINGFACE_API_KEY

# Set in .env file
echo "HUGGINGFACE_API_KEY=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" > .env
```

#### 2. Dependencies Missing
```bash
# Install dependencies
pip install -r backend/requirements.txt
```

#### 3. Flask App Not Starting
```bash
# Check if port 5000 is available
netstat -an | grep 5000

# Use different port
export FLASK_RUN_PORT=5001
```

#### 4. LLM Analysis Failing
- Check API key validity
- Verify internet connection
- Check Hugging Face API status

## 🎯 Next Steps

1. **Test the Workflow**: Run `test_complete_workflow.py`
2. **Integrate Frontend**: Connect your UI to the new endpoints
3. **Customize Analysis**: Modify LLM prompts for specific needs
4. **Scale Up**: Add more input types and analysis capabilities
5. **Monitor Performance**: Track analysis quality and speed

## 📞 Support

If you encounter issues:
1. Check the logs in your Flask app
2. Verify API key and network connectivity
3. Test with the provided test script
4. Review the error messages for specific issues

The complete workflow is now ready to use! 🎉
