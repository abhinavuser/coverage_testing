#!/usr/bin/env python3
"""
Quick Test Script - Verify API Key and Basic Setup
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
API_KEY = os.getenv('HUGGINGFACE_API_KEY')
if not API_KEY:
    print("❌ HUGGINGFACE_API_KEY not found in environment variables!")
    print("Please create a .env file with your API key")
    exit(1)

def test_api_key():
    """Test the Hugging Face API key"""
    print("🔑 Testing Hugging Face API Key...")
    print(f"Key: {API_KEY[:10]}...")
    
    try:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        response = requests.get(
            "https://api-inference.huggingface.co/models/gpt2",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ API key is valid and working!")
            return True
        elif response.status_code == 404:
            print("✅ API key is valid! (Model not found, but API responded)")
            return True
        else:
            print(f"❌ API key test failed: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ API key test failed: {str(e)}")
        return False

def test_dependencies():
    """Test if required packages are installed"""
    print("\n📦 Testing Dependencies...")
    
    required_packages = [
        'flask', 'pandas', 'requests', 'gitpython', 
        'scikit-learn', 'xgboost', 'numpy'
    ]
    
    all_good = True
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - MISSING")
            all_good = False
    
    return all_good

def test_llm_analyzer():
    """Test LLM Analyzer initialization"""
    print("\n🤖 Testing LLM Analyzer...")
    
    try:
        from backend.app.llm_analyzer import LLMAnalyzer
        
        analyzer = LLMAnalyzer()
        print("✅ LLM Analyzer initialized successfully!")
        print(f"✅ Using API key: {analyzer.api_key[:10]}...")
        return True
        
    except Exception as e:
        print(f"❌ LLM Analyzer test failed: {str(e)}")
        return False

def test_coverage_generator():
    """Test Coverage Generator initialization"""
    print("\n📊 Testing Coverage Generator...")
    
    try:
        from backend.app.coverage_generator import CoverageDatasetGenerator
        
        generator = CoverageDatasetGenerator()
        print("✅ Coverage Generator initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Coverage Generator test failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🚀 Quick Test - Coverage Analysis System")
    print("=" * 50)
    
    # Test API key
    api_ok = test_api_key()
    
    # Test dependencies
    deps_ok = test_dependencies()
    
    # Test LLM Analyzer
    llm_ok = test_llm_analyzer()
    
    # Test Coverage Generator
    gen_ok = test_coverage_generator()
    
    print("\n" + "=" * 50)
    print("📋 TEST RESULTS:")
    print(f"API Key: {'✅ OK' if api_ok else '❌ FAILED'}")
    print(f"Dependencies: {'✅ OK' if deps_ok else '❌ FAILED'}")
    print(f"LLM Analyzer: {'✅ OK' if llm_ok else '❌ FAILED'}")
    print(f"Coverage Generator: {'✅ OK' if gen_ok else '❌ FAILED'}")
    
    if all([api_ok, deps_ok, llm_ok, gen_ok]):
        print("\n🎉 All tests passed! Your system is ready!")
        print("🚀 Run: python start_workflow.py")
    else:
        print("\n❌ Some tests failed. Check the errors above.")
        print("🔧 Fix the issues before running the full workflow.")

if __name__ == "__main__":
    main()
