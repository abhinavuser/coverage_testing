#!/usr/bin/env python3
"""
Test LLM Integration
Demonstrates how to use the LLM analyzer with coverage data
"""

import os
import pandas as pd
import tempfile
from backend.app.llm_analyzer import LLMAnalyzer
from backend.app.coverage_generator import CoverageDatasetGenerator

def create_sample_dataset():
    """Create a sample coverage dataset for testing"""
    sample_data = [
        ['auth/login', 'auth', 'high', 4.2, 3.1, 'uncovered', 'Critical'],
        ['payment/checkout', 'payment', 'high', 4.8, 4.5, 'partial', 'Critical'],
        ['user/profile', 'user', 'medium', 2.1, 2.8, 'covered', 'High'],
        ['product/catalog', 'product', 'medium', 1.8, 2.2, 'uncovered', 'Medium'],
        ['admin/dashboard', 'admin', 'high', 3.5, 3.9, 'uncovered', 'High'],
        ['api/health', 'api', 'low', 1.2, 1.5, 'covered', 'Low'],
        ['database/connection', 'database', 'high', 4.1, 3.8, 'partial', 'Critical'],
        ['utils/validation', 'utils', 'medium', 2.3, 2.1, 'covered', 'Medium']
    ]
    
    df = pd.DataFrame(sample_data, columns=[
        'name', 'module', 'priority', 'risk_score', 'complexity_score', 
        'status', 'business_impact'
    ])
    
    # Create temporary file
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False)
    df.to_csv(temp_file.name, index=False)
    temp_file.close()
    
    return temp_file.name

def test_llm_analysis():
    """Test LLM analysis functionality"""
    print("=== Testing LLM Integration ===\n")
    
    # Create sample dataset
    dataset_path = create_sample_dataset()
    print(f"Created sample dataset: {dataset_path}")
    
    # Sample project metadata
    project_metadata = {
        'total_files': 150,
        'dockerfiles': 2,
        'manifests': 3,
        'modules': 8,
        'project_name': 'Sample E-commerce App',
        'technology_stack': ['Python', 'Flask', 'PostgreSQL', 'Docker']
    }
    
    # Initialize LLM analyzer
    # Note: Set your Hugging Face API key in environment variable HUGGINGFACE_API_KEY
    llm_analyzer = LLMAnalyzer()
    
    print("Performing LLM analysis...")
    
    # Perform analysis
    result = llm_analyzer.analyze_coverage_data(dataset_path, project_metadata)
    
    if result['success']:
        print("✅ LLM Analysis completed successfully!")
        
        # Display results
        analysis = result['analysis']
        
        print("\n=== SECURITY ANALYSIS ===")
        security = analysis['security_analysis']
        print(f"Vulnerability count: {security.get('vulnerability_count', 0)}")
        print(f"High risk items: {len(security.get('high_risk_items', []))}")
        
        print("\n=== COVERAGE GAPS ===")
        gaps = analysis['coverage_gaps']
        print(f"Total gaps: {gaps.get('total_gaps', 0)}")
        print(f"Critical gaps: {gaps.get('critical_gaps', 0)}")
        print(f"High priority gaps: {gaps.get('high_priority_gaps', 0)}")
        
        print("\n=== TEST RECOMMENDATIONS ===")
        test_recs = analysis['test_recommendations']
        print(f"Recommended test cases: {test_recs.get('test_case_count', 0)}")
        
        print("\n=== RISK ASSESSMENT ===")
        risk = analysis['risk_assessment']
        print(f"Overall risk score: {risk.get('overall_risk_score', 0):.2f}")
        print(f"High risk items: {risk.get('high_risk_items', 0)}")
        
        print("\n=== SUMMARY ===")
        summary = analysis['summary']
        print(f"Total artifacts: {summary.get('total_artifacts', 0)}")
        print(f"Coverage percentage: {summary.get('coverage_percentage', 0):.1f}%")
        print(f"Critical items: {summary.get('critical_items', 0)}")
        
        # Show LLM insights if available
        if 'llm_summary' in summary:
            print(f"\nLLM Summary: {summary['llm_summary'][:200]}...")
        
    else:
        print(f"❌ LLM Analysis failed: {result.get('error', 'Unknown error')}")
    
    # Cleanup
    os.unlink(dataset_path)
    print(f"\nCleaned up temporary file: {dataset_path}")

def test_coverage_generator():
    """Test coverage dataset generation"""
    print("\n=== Testing Coverage Generator ===\n")
    
    # Test with a sample GitHub repo (you can replace with any public repo)
    test_repo = "https://github.com/jenstroeger/python-package-template"
    
    print(f"Testing with repository: {test_repo}")
    
    try:
        coverage_generator = CoverageDatasetGenerator()
        result = coverage_generator.process_input(test_repo, 'github')
        
        if result['success']:
            print("✅ Coverage dataset generated successfully!")
            print(f"Dataset path: {result['dataset_path']}")
            print(f"Metadata: {result['metadata']}")
            
            # Load and display dataset
            df = pd.read_csv(result['dataset_path'])
            print(f"\nDataset shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
            print("\nFirst few rows:")
            print(df.head())
            
        else:
            print(f"❌ Coverage generation failed: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Error during coverage generation: {str(e)}")

def main():
    """Main test function"""
    print("🚀 Testing LLM Integration with Coverage Analysis\n")
    
    # Test 1: LLM Analysis
    test_llm_analysis()
    
    # Test 2: Coverage Generator
    test_coverage_generator()
    
    print("\n" + "="*50)
    print("🎉 Testing completed!")
    print("\nTo use this in your application:")
    print("1. Set HUGGINGFACE_API_KEY environment variable")
    print("2. Import LLMAnalyzer and CoverageDatasetGenerator")
    print("3. Use the API endpoints in your Flask app")
    print("4. Handle the analysis results in your frontend")

if __name__ == "__main__":
    main()
