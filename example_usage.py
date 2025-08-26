#!/usr/bin/env python3
"""
Example Usage of LLM Integration
Demonstrates practical usage scenarios for the coverage analysis system
"""

import os
import json
from backend.app.coverage_generator import CoverageDatasetGenerator
from backend.app.llm_analyzer import LLMAnalyzer

def example_github_analysis():
    """Example: Analyze a GitHub repository"""
    print("🔍 Example 1: GitHub Repository Analysis")
    print("=" * 50)
    
    # Initialize components
    coverage_generator = CoverageDatasetGenerator()
    llm_analyzer = LLMAnalyzer()
    
    # Example GitHub repository (replace with your target repo)
    github_url = "https://github.com/jenstroeger/python-package-template"
    
    print(f"Analyzing repository: {github_url}")
    
    # Step 1: Generate coverage dataset
    print("\n📊 Step 1: Generating coverage dataset...")
    result = coverage_generator.process_input(github_url, 'github')
    
    if not result['success']:
        print(f"❌ Failed to generate dataset: {result['error']}")
        return
    
    print(f"✅ Dataset generated successfully!")
    print(f"   - Total files: {result['metadata'].get('total_files', 0)}")
    print(f"   - Dockerfiles: {result['metadata'].get('dockerfiles', 0)}")
    print(f"   - Manifests: {result['metadata'].get('manifests', 0)}")
    print(f"   - Modules: {result['metadata'].get('modules', 0)}")
    
    # Step 2: Perform LLM analysis
    print("\n🤖 Step 2: Performing LLM analysis...")
    analysis = llm_analyzer.analyze_coverage_data(
        result['dataset_path'], 
        result['metadata']
    )
    
    if not analysis['success']:
        print(f"❌ LLM analysis failed: {analysis.get('error', 'Unknown error')}")
        return
    
    # Step 3: Display results
    print("\n📈 Step 3: Analysis Results")
    print("-" * 30)
    
    # Security Analysis
    security = analysis['analysis']['security_analysis']
    print(f"🔒 Security Vulnerabilities: {security.get('vulnerability_count', 0)}")
    print(f"   High risk items: {len(security.get('high_risk_items', []))}")
    
    # Coverage Gaps
    gaps = analysis['analysis']['coverage_gaps']
    print(f"📋 Coverage Gaps: {gaps.get('total_gaps', 0)}")
    print(f"   Critical gaps: {gaps.get('critical_gaps', 0)}")
    print(f"   High priority gaps: {gaps.get('high_priority_gaps', 0)}")
    
    # Test Recommendations
    test_recs = analysis['analysis']['test_recommendations']
    print(f"🧪 Recommended Test Cases: {test_recs.get('test_case_count', 0)}")
    
    # Risk Assessment
    risk = analysis['analysis']['risk_assessment']
    print(f"⚠️  Overall Risk Score: {risk.get('overall_risk_score', 0):.2f}")
    print(f"   High risk items: {risk.get('high_risk_items', 0)}")
    
    # Summary
    summary = analysis['analysis']['summary']
    print(f"📊 Coverage Percentage: {summary.get('coverage_percentage', 0):.1f}%")
    print(f"   Critical items: {summary.get('critical_items', 0)}")
    
    print("\n" + "=" * 50)

def example_docker_compose_analysis():
    """Example: Analyze Docker Compose content"""
    print("🐳 Example 2: Docker Compose Analysis")
    print("=" * 50)
    
    # Sample Docker Compose content
    docker_compose_content = """
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
    volumes:
      - .:/app
    command: python app.py
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
"""
    
    print("Analyzing Docker Compose configuration...")
    
    # Initialize components
    coverage_generator = CoverageDatasetGenerator()
    llm_analyzer = LLMAnalyzer()
    
    # Generate coverage dataset
    result = coverage_generator.process_input(docker_compose_content, 'docker_compose')
    
    if not result['success']:
        print(f"❌ Failed to analyze Docker Compose: {result['error']}")
        return
    
    # Perform LLM analysis
    analysis = llm_analyzer.analyze_coverage_data(
        result['dataset_path'], 
        result['metadata']
    )
    
    if analysis['success']:
        print("✅ Docker Compose analysis completed!")
        
        # Display security insights
        security = analysis['analysis']['security_analysis']
        if 'analysis' in security and security['analysis'] != 'Security analysis requires LLM API key':
            print(f"\n🔒 Security Insights:")
            print(security['analysis'][:300] + "...")
        
        # Display workflow analysis
        workflow = analysis['analysis']['workflow_analysis']
        if 'workflow_analysis' in workflow and workflow['workflow_analysis'] != 'Workflow analysis requires LLM API key':
            print(f"\n🔄 Workflow Analysis:")
            print(workflow['workflow_analysis'][:300] + "...")
    
    print("\n" + "=" * 50)

def example_api_usage():
    """Example: Using the API endpoints"""
    print("🌐 Example 3: API Usage")
    print("=" * 50)
    
    import requests
    
    # Example API calls (assuming Flask app is running on localhost:5000)
    base_url = "http://localhost:5000/api"
    
    print("Available API endpoints:")
    print("1. POST /coverage/github - Analyze GitHub repository")
    print("2. POST /coverage/upload - Upload ZIP file")
    print("3. POST /coverage/docker-compose - Analyze Docker Compose")
    print("4. POST /coverage/analyze - Generic analysis")
    print("5. POST /llm/analyze - LLM analysis only")
    
    # Example: GitHub analysis via API
    github_data = {
        "github_url": "https://github.com/jenstroeger/python-package-template"
    }
    
    print(f"\n📡 Example API call:")
    print(f"POST {base_url}/coverage/github")
    print(f"Body: {json.dumps(github_data, indent=2)}")
    
    # Uncomment to make actual API call
    # try:
    #     response = requests.post(f"{base_url}/coverage/github", json=github_data)
    #     if response.status_code == 200:
    #         result = response.json()
    #         print(f"✅ API call successful!")
    #         print(f"Security vulnerabilities: {result['llm_analysis']['analysis']['security_analysis']['vulnerability_count']}")
    #     else:
    #         print(f"❌ API call failed: {response.status_code}")
    # except Exception as e:
    #     print(f"❌ API call error: {str(e)}")
    
    print("\n" + "=" * 50)

def example_custom_analysis():
    """Example: Custom analysis with specific focus"""
    print("🎯 Example 4: Custom Analysis")
    print("=" * 50)
    
    # Create custom LLM analyzer with specific model
    llm_analyzer = LLMAnalyzer(
        api_key=os.getenv('HUGGINGFACE_API_KEY'),
        model_name="microsoft/DialoGPT-medium"  # You can change the model
    )
    
    # Sample project metadata
    project_metadata = {
        'total_files': 200,
        'dockerfiles': 3,
        'manifests': 5,
        'modules': 12,
        'project_name': 'E-commerce Platform',
        'technology_stack': ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
        'business_domain': 'E-commerce',
        'security_requirements': 'PCI DSS compliant'
    }
    
    # Create sample dataset (in real usage, this would come from coverage_generator)
    import pandas as pd
    import tempfile
    
    sample_data = [
        ['payment/processor', 'payment', 'high', 4.8, 4.2, 'uncovered', 'Critical'],
        ['auth/oauth', 'auth', 'high', 4.5, 3.8, 'partial', 'Critical'],
        ['user/checkout', 'user', 'high', 4.2, 3.5, 'uncovered', 'Critical'],
        ['product/inventory', 'product', 'medium', 2.8, 2.5, 'covered', 'High'],
        ['admin/orders', 'admin', 'high', 3.9, 3.2, 'uncovered', 'High'],
        ['api/webhooks', 'api', 'medium', 3.1, 2.8, 'partial', 'Medium'],
        ['database/migrations', 'database', 'high', 4.1, 3.6, 'uncovered', 'Critical'],
        ['utils/encryption', 'utils', 'high', 4.6, 3.9, 'partial', 'Critical']
    ]
    
    df = pd.DataFrame(sample_data, columns=[
        'name', 'module', 'priority', 'risk_score', 'complexity_score', 
        'status', 'business_impact'
    ])
    
    # Save to temporary file
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False)
    df.to_csv(temp_file.name, index=False)
    temp_file.close()
    
    print("Performing custom analysis for E-commerce platform...")
    
    # Perform analysis
    analysis = llm_analyzer.analyze_coverage_data(temp_file.name, project_metadata)
    
    if analysis['success']:
        print("✅ Custom analysis completed!")
        
        # Focus on security analysis for e-commerce
        security = analysis['analysis']['security_analysis']
        print(f"\n🔒 E-commerce Security Analysis:")
        print(f"   - Vulnerability count: {security.get('vulnerability_count', 0)}")
        print(f"   - High risk items: {len(security.get('high_risk_items', []))}")
        
        # Focus on payment-related gaps
        gaps = analysis['analysis']['coverage_gaps']
        print(f"\n💳 Payment Security Gaps:")
        print(f"   - Critical gaps: {gaps.get('critical_gaps', 0)}")
        print(f"   - High priority gaps: {gaps.get('high_priority_gaps', 0)}")
        
        # Show LLM insights if available
        if 'llm_summary' in analysis['analysis']['summary']:
            summary = analysis['analysis']['summary']['llm_summary']
            if summary != 'Security analysis requires LLM API key':
                print(f"\n📋 LLM Summary:")
                print(summary[:500] + "...")
    
    # Cleanup
    os.unlink(temp_file.name)
    
    print("\n" + "=" * 50)

def main():
    """Run all examples"""
    print("🚀 LLM Integration Examples")
    print("=" * 60)
    print("This script demonstrates various usage scenarios for the LLM integration.")
    print("Make sure to set HUGGINGFACE_API_KEY environment variable for full functionality.\n")
    
    # Check if API key is set
    if not os.getenv('HUGGINGFACE_API_KEY'):
        print("⚠️  Warning: HUGGINGFACE_API_KEY not set. LLM features will be limited.")
        print("   Set it with: export HUGGINGFACE_API_KEY='your_key_here'\n")
    
    # Run examples
    example_github_analysis()
    example_docker_compose_analysis()
    example_api_usage()
    example_custom_analysis()
    
    print("🎉 All examples completed!")
    print("\nNext steps:")
    print("1. Set up your Hugging Face API key")
    print("2. Start your Flask application")
    print("3. Test the API endpoints")
    print("4. Integrate with your frontend application")
    print("5. Customize analysis for your specific needs")

if __name__ == "__main__":
    main()
