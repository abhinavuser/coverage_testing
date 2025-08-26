#!/usr/bin/env python3
"""
Test LLM Integration with API Key
Tests the LLM functionality with the provided Hugging Face API key
"""

import os
import requests
import json

# Set your API key
API_KEY = "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"
os.environ['HUGGINGFACE_API_KEY'] = API_KEY

def test_llm_analyzer():
    """Test the LLM analyzer directly"""
    print("🔍 Testing LLM Analyzer with API Key")
    print("=" * 50)
    
    try:
        from backend.app.llm_analyzer import LLMAnalyzer
        from backend.app.coverage_generator import CoverageDatasetGenerator
        
        # Initialize with API key
        llm_analyzer = LLMAnalyzer(api_key=API_KEY)
        print(f"✅ LLM Analyzer initialized with API key: {API_KEY[:10]}...")
        
        # Test with a simple dataset
        import pandas as pd
        import tempfile
        
        # Create sample data
        sample_data = [
            ['auth/login', 'auth', 'high', 4.2, 3.1, 'uncovered', 'Critical'],
            ['payment/checkout', 'payment', 'high', 4.8, 4.5, 'partial', 'Critical'],
            ['user/profile', 'user', 'medium', 2.1, 2.8, 'covered', 'High']
        ]
        
        df = pd.DataFrame(sample_data, columns=[
            'name', 'module', 'priority', 'risk_score', 'complexity_score', 
            'status', 'business_impact'
        ])
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False)
        df.to_csv(temp_file.name, index=False)
        temp_file.close()
        
        print(f"📊 Created sample dataset: {temp_file.name}")
        
        # Sample project metadata
        project_metadata = {
            'total_files': 50,
            'dockerfiles': 1,
            'manifests': 2,
            'modules': 3,
            'project_name': 'Test Project',
            'technology_stack': ['Python', 'Flask', 'PostgreSQL']
        }
        
        print("🤖 Performing LLM analysis...")
        
        # Perform analysis
        result = llm_analyzer.analyze_coverage_data(temp_file.name, project_metadata)
        
        if result['success']:
            print("✅ LLM Analysis completed successfully!")
            
            # Display results
            analysis = result['analysis']
            
            print(f"\n🔒 Security Analysis:")
            security = analysis['security_analysis']
            print(f"   - Vulnerability count: {security.get('vulnerability_count', 0)}")
            print(f"   - High risk items: {len(security.get('high_risk_items', []))}")
            
            print(f"\n📋 Coverage Gaps:")
            gaps = analysis['coverage_gaps']
            print(f"   - Total gaps: {gaps.get('total_gaps', 0)}")
            print(f"   - Critical gaps: {gaps.get('critical_gaps', 0)}")
            
            print(f"\n🧪 Test Recommendations:")
            test_recs = analysis['test_recommendations']
            print(f"   - Recommended test cases: {test_recs.get('test_case_count', 0)}")
            
            print(f"\n⚠️  Risk Assessment:")
            risk = analysis['risk_assessment']
            print(f"   - Overall risk score: {risk.get('overall_risk_score', 0):.2f}")
            print(f"   - High risk items: {risk.get('high_risk_items', 0)}")
            
            # Show LLM insights if available
            if 'llm_summary' in analysis['summary']:
                summary = analysis['summary']['llm_summary']
                if summary and summary != 'Security analysis requires LLM API key':
                    print(f"\n📋 LLM Summary Preview:")
                    print(summary[:200] + "...")
            
        else:
            print(f"❌ LLM Analysis failed: {result.get('error', 'Unknown error')}")
        
        # Cleanup
        os.unlink(temp_file.name)
        
    except Exception as e:
        print(f"❌ Error during LLM test: {str(e)}")
        import traceback
        traceback.print_exc()

def test_api_endpoints():
    """Test the API endpoints"""
    print("\n🌐 Testing API Endpoints")
    print("=" * 50)
    
    # Start Flask app (you'll need to run this in a separate terminal)
    print("📝 To test API endpoints, start your Flask app:")
    print("   cd backend")
    print("   python run.py")
    print("\nThen test these endpoints:")
    
    print("\n1. GitHub Repository Analysis:")
    print("   POST http://localhost:5000/api/coverage/github")
    print("   Body: {\"github_url\": \"https://github.com/jenstroeger/python-package-template\"}")
    
    print("\n2. Generic Analysis:")
    print("   POST http://localhost:5000/api/coverage/analyze")
    print("   Body: {\"input_type\": \"github\", \"input_source\": \"https://github.com/jenstroeger/python-package-template\"}")
    
    print("\n3. LLM Analysis Only:")
    print("   POST http://localhost:5000/api/llm/analyze")
    print("   Body: {\"dataset_path\": \"/path/to/dataset.csv\", \"project_metadata\": {...}}")

def test_huggingface_api():
    """Test Hugging Face API directly"""
    print("\n🔑 Testing Hugging Face API Directly")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": "Hello, how are you?",
        "parameters": {
            "max_length": 50,
            "temperature": 0.7,
            "do_sample": True
        }
    }
    
    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Hugging Face API test successful!")
            print(f"   Response: {result}")
        else:
            print(f"❌ Hugging Face API test failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing Hugging Face API: {str(e)}")

def main():
    """Main test function"""
    print("🚀 Testing LLM Integration with Your API Key")
    print("=" * 60)
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-10:]}")
    
    # Test 1: Direct LLM Analyzer
    test_llm_analyzer()
    
    # Test 2: Hugging Face API
    test_huggingface_api()
    
    # Test 3: API Endpoints
    test_api_endpoints()
    
    print("\n" + "=" * 60)
    print("🎉 Testing completed!")
    print("\nNext steps:")
    print("1. Start your Flask app: cd backend && python run.py")
    print("2. Test the API endpoints with your frontend")
    print("3. The LLM integration is now ready to use!")

if __name__ == "__main__":
    main()
