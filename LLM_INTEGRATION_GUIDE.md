# LLM Integration Guide for Coverage Analysis

## Overview

This guide explains how to integrate LLM (Large Language Model) capabilities into your functional testing coverage system. The integration provides intelligent analysis of coverage data, security vulnerability detection, and automated test case recommendations.

## Features

### 🎯 **Core Capabilities**
- **Coverage Dataset Generation**: Analyze GitHub repos, ZIP files, and Docker Compose
- **Security Vulnerability Analysis**: Identify security risks and gaps
- **Test Case Recommendations**: Generate comprehensive test scenarios
- **Workflow Analysis**: Understand application flows and endpoints
- **Risk Assessment**: Prioritize testing efforts based on business impact
- **Executive Summaries**: Get actionable insights for stakeholders

### 🔧 **Input Methods**
1. **GitHub Repository URL**: Direct analysis of public/private repos
2. **ZIP File Upload**: Analyze local codebases
3. **Docker Compose Content**: Container-based application analysis

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Set your Hugging Face API key
export HUGGINGFACE_API_KEY="your_api_key_here"
```

### 2. Basic Usage

```python
from backend.app.coverage_generator import CoverageDatasetGenerator
from backend.app.llm_analyzer import LLMAnalyzer

# Initialize components
coverage_generator = CoverageDatasetGenerator()
llm_analyzer = LLMAnalyzer()

# Analyze GitHub repository
result = coverage_generator.process_input(
    "https://github.com/username/repo", 
    "github"
)

if result['success']:
    # Perform LLM analysis
    analysis = llm_analyzer.analyze_coverage_data(
        result['dataset_path'], 
        result['metadata']
    )
    
    print("Analysis completed!")
    print(f"Security vulnerabilities: {analysis['analysis']['security_analysis']['vulnerability_count']}")
    print(f"Coverage gaps: {analysis['analysis']['coverage_gaps']['total_gaps']}")
```

## API Endpoints

### 1. Analyze GitHub Repository
```http
POST /api/coverage/github
Content-Type: application/json

{
    "github_url": "https://github.com/username/repo"
}
```

### 2. Upload ZIP File
```http
POST /api/coverage/upload
Content-Type: multipart/form-data

file: your_project.zip
```

### 3. Analyze Docker Compose
```http
POST /api/coverage/docker-compose
Content-Type: application/json

{
    "docker_compose_content": "version: '3.8'..."
}
```

### 4. Generic Analysis
```http
POST /api/coverage/analyze
Content-Type: application/json

{
    "input_type": "github|zip|docker_compose",
    "input_source": "url_or_content"
}
```

## LLM Analysis Components

### 1. Security Analysis
- **Authentication vulnerabilities**
- **Authorization gaps**
- **Data exposure risks**
- **Input validation issues**
- **Dependency security**
- **Infrastructure security**

### 2. Coverage Gap Analysis
- **Uncovered critical paths**
- **High-priority gaps**
- **Module-specific gaps**
- **Risk mitigation strategies**

### 3. Test Recommendations
- **Unit test scenarios**
- **Integration test cases**
- **API endpoint testing**
- **Security test cases**
- **Performance testing**
- **User journey flows**

### 4. Workflow Analysis
- **API endpoint identification**
- **User journey mapping**
- **Data flow analysis**
- **Integration points**
- **Error handling paths**

## Configuration

### Environment Variables
```bash
# Required for LLM features
HUGGINGFACE_API_KEY=your_api_key_here

# Optional configurations
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

### Model Selection
The system uses Hugging Face models. You can change the model by modifying the `model_name` parameter:

```python
llm_analyzer = LLMAnalyzer(
    api_key="your_key",
    model_name="microsoft/DialoGPT-medium"  # or any other model
)
```

## Sample Response Structure

```json
{
    "success": true,
    "dataset_generation": {
        "success": true,
        "dataset_path": "/tmp/coverage_dataset.csv",
        "metadata": {
            "total_files": 150,
            "dockerfiles": 2,
            "manifests": 3,
            "modules": 8
        }
    },
    "llm_analysis": {
        "success": true,
        "analysis": {
            "security_analysis": {
                "analysis": "LLM-generated security insights...",
                "vulnerability_count": 5,
                "high_risk_items": [...]
            },
            "coverage_gaps": {
                "total_gaps": 12,
                "critical_gaps": 3,
                "high_priority_gaps": 5,
                "llm_recommendations": "LLM-generated gap analysis..."
            },
            "test_recommendations": {
                "recommendations": "LLM-generated test cases...",
                "test_case_count": 45,
                "automation_opportunities": {...}
            },
            "risk_assessment": {
                "overall_risk_score": 3.2,
                "high_risk_items": 8,
                "llm_insights": "LLM-generated risk analysis..."
            },
            "workflow_analysis": {
                "workflow_analysis": "LLM-generated workflow insights...",
                "estimated_endpoints": 24,
                "user_journeys": [...]
            },
            "summary": {
                "total_artifacts": 25,
                "coverage_percentage": 68.5,
                "critical_items": 5,
                "llm_summary": "Executive summary..."
            }
        }
    }
}
```

## Testing

Run the test script to verify your setup:

```bash
python test_llm_integration.py
```

This will:
1. Create a sample dataset
2. Test LLM analysis functionality
3. Test coverage generation
4. Display results and insights

## Best Practices

### 1. API Key Management
- Store API keys in environment variables
- Never commit keys to version control
- Use `.env` files for local development

### 2. Error Handling
- Always check `success` field in responses
- Handle API rate limits gracefully
- Provide fallback analysis when LLM is unavailable

### 3. Performance Optimization
- Cache analysis results for repeated requests
- Use background tasks for long-running analysis
- Implement request queuing for high-volume usage

### 4. Security Considerations
- Validate all input data
- Sanitize file uploads
- Implement proper authentication/authorization
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **API Key Not Set**
   ```
   Error: No Hugging Face API key provided
   Solution: Set HUGGINGFACE_API_KEY environment variable
   ```

2. **Rate Limiting**
   ```
   Error: API call failed: 429
   Solution: Implement retry logic with exponential backoff
   ```

3. **Model Loading Issues**
   ```
   Error: Model not found
   Solution: Check model name or use a different model
   ```

4. **File Upload Errors**
   ```
   Error: Failed to extract zip file
   Solution: Ensure ZIP file is valid and not corrupted
   ```

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

llm_analyzer = LLMAnalyzer()
```

## Integration with Frontend

### React Example
```javascript
const analyzeRepository = async (githubUrl) => {
    try {
        const response = await fetch('/api/coverage/github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ github_url: githubUrl })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Handle analysis results
            console.log('Security vulnerabilities:', 
                result.llm_analysis.analysis.security_analysis.vulnerability_count);
            console.log('Coverage gaps:', 
                result.llm_analysis.analysis.coverage_gaps.total_gaps);
        }
    } catch (error) {
        console.error('Analysis failed:', error);
    }
};
```

## Cost Optimization

### Hugging Face API Costs
- Free tier: 30,000 requests/month
- Pay-as-you-go: $0.06 per 1,000 requests
- Pro plan: $9/month for 500,000 requests

### Optimization Strategies
1. **Cache Results**: Store analysis results to avoid re-analysis
2. **Batch Processing**: Process multiple items in single requests
3. **Selective Analysis**: Only use LLM for critical components
4. **Local Models**: Consider using local LLM models for development

## Future Enhancements

### Planned Features
- **Multi-model Support**: Integration with OpenAI, Claude, and local models
- **Custom Prompts**: Allow users to customize analysis prompts
- **Batch Processing**: Analyze multiple repositories simultaneously
- **Real-time Analysis**: WebSocket-based real-time analysis updates
- **Advanced Security**: Integration with security scanning tools
- **Performance Metrics**: Track analysis performance and accuracy

### Contributing
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the test examples
3. Open an issue on GitHub
4. Contact the development team

---

**Note**: This integration requires a Hugging Face API key for full functionality. The system provides fallback analysis when the API key is not available.
