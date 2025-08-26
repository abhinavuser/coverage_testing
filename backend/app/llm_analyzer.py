"""
LLM Analyzer for Coverage Analysis
Integrates with Hugging Face API to provide intelligent analysis and recommendations
"""

import os
import json
import pandas as pd
from typing import Dict, List, Any, Optional
import requests
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class LLMAnalyzer:
    """
    LLM-powered analyzer for coverage data and security insights
    """
    
    def __init__(self, api_key: str = None, model_name: str = "gpt2"):
        # Use provided API key or get from environment variable
        self.api_key = api_key or os.getenv('HUGGINGFACE_API_KEY')
        self.model_name = model_name
        self.base_url = "https://api-inference.huggingface.co/models"
        
        if not self.api_key:
            logging.warning("No Hugging Face API key provided. LLM features will be disabled.")
        else:
            logging.info(f"LLM Analyzer initialized with API key: {self.api_key[:10]}...")
    
    def analyze_coverage_data(self, dataset_path: str, project_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze coverage dataset and provide comprehensive insights
        
        Args:
            dataset_path: Path to the coverage dataset CSV
            project_metadata: Metadata about the project
            
        Returns:
            Dict containing analysis results
        """
        try:
            # Load dataset
            df = pd.read_csv(dataset_path)
            
            # Generate different types of analysis
            analysis_results = {
                'security_analysis': self._analyze_security_vulnerabilities(df, project_metadata),
                'coverage_gaps': self._analyze_coverage_gaps(df),
                'test_recommendations': self._analyze_test_recommendations(df, project_metadata),
                'risk_assessment': self._analyze_risk_assessment(df),
                'workflow_analysis': self._analyze_workflow(df, project_metadata),
                'endpoint_analysis': self._analyze_endpoints(df, project_metadata),
                'summary': self._generate_summary(df, project_metadata)
            }
            
            return {
                'success': True,
                'analysis': analysis_results,
                'dataset_stats': self._get_dataset_stats(df),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Error in coverage analysis: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'analysis': {},
                'dataset_stats': {},
                'timestamp': datetime.now().isoformat()
            }
    
    def _analyze_security_vulnerabilities(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze security vulnerabilities in the codebase"""
        if not self.api_key:
            return self._fallback_security_analysis(df)
        
        # Prepare context for LLM
        context = self._prepare_security_context(df, metadata)
        
        prompt = f"""
        As a security expert, analyze this codebase for potential security vulnerabilities:

        PROJECT CONTEXT:
        {context}

        DATASET SUMMARY:
        - Total artifacts: {len(df)}
        - High priority items: {len(df[df['priority'] == 'high'])}
        - Critical business impact: {len(df[df['business_impact'] == 'Critical'])}
        - Uncovered items: {len(df[df['status'] == 'uncovered'])}

        Please provide:
        1. Critical security vulnerabilities found
        2. Authentication and authorization issues
        3. Data exposure risks
        4. Input validation concerns
        5. Dependency security issues
        6. Infrastructure security gaps
        7. Recommended security test cases

        Format your response as a structured analysis with clear sections.
        """
        
        try:
            response = self._call_llm_api(prompt)
            return {
                'analysis': response,
                'vulnerability_count': len(df[df['risk_score'] > 3.0]),
                'high_risk_items': df[df['risk_score'] > 4.0].to_dict('records')
            }
        except Exception as e:
            logging.error(f"LLM security analysis failed: {str(e)}")
            return self._fallback_security_analysis(df)
    
    def _analyze_coverage_gaps(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze test coverage gaps"""
        uncovered = df[df['status'] == 'uncovered']
        partial = df[df['status'] == 'partial']
        
        gaps_analysis = {
            'total_gaps': len(uncovered) + len(partial),
            'critical_gaps': len(uncovered[uncovered['business_impact'] == 'Critical']),
            'high_priority_gaps': len(uncovered[uncovered['priority'] == 'high']),
            'gaps_by_module': uncovered.groupby('module').size().astype(int).to_dict(),
            'gaps_by_priority': uncovered.groupby('priority').size().astype(int).to_dict(),
            'recommended_focus_areas': self._identify_focus_areas(uncovered)
        }
        
        if self.api_key:
            prompt = f"""
            Analyze these test coverage gaps and provide recommendations:

            COVERAGE GAPS:
            - Total uncovered items: {len(uncovered)}
            - Partial coverage items: {len(partial)}
            - Critical business impact gaps: {gaps_analysis['critical_gaps']}
            - High priority gaps: {gaps_analysis['high_priority_gaps']}

            GAPS BY MODULE:
            {gaps_analysis['gaps_by_module']}

            Please provide:
            1. Priority order for addressing gaps
            2. Recommended test strategies for each gap type
            3. Estimated effort for each gap category
            4. Risk mitigation strategies
            """
            
            try:
                response = self._call_llm_api(prompt)
                gaps_analysis['llm_recommendations'] = response
            except Exception as e:
                logging.error(f"LLM coverage gaps analysis failed: {str(e)}")
        
        return gaps_analysis
    
    def _analyze_test_recommendations(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Generate intelligent test case recommendations"""
        if not self.api_key:
            return self._fallback_test_recommendations(df)
        
        context = self._prepare_test_context(df, metadata)
        
        prompt = f"""
        As a QA automation expert, generate comprehensive test case recommendations:

        PROJECT CONTEXT:
        {context}

        Please provide:
        1. Unit test recommendations for each module
        2. Integration test scenarios
        3. API endpoint test cases
        4. Security test cases
        5. Performance test scenarios
        6. User journey test flows
        7. Data validation test cases
        8. Error handling test scenarios

        For each recommendation, include:
        - Test case description
        - Expected inputs/outputs
        - Priority level
        - Estimated complexity
        - Automation feasibility
        """
        
        try:
            response = self._call_llm_api(prompt)
            return {
                'recommendations': response,
                'test_case_count': len(df) * 3,  # Estimate 3 test cases per artifact
                'automation_opportunities': self._identify_automation_opportunities(df)
            }
        except Exception as e:
            logging.error(f"LLM test recommendations failed: {str(e)}")
            return self._fallback_test_recommendations(df)
    
    def _analyze_risk_assessment(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Perform comprehensive risk assessment"""
        risk_analysis = {
            'overall_risk_score': df['risk_score'].mean(),
            'high_risk_items': len(df[df['risk_score'] > 4.0]),
            'critical_impact_items': len(df[df['business_impact'] == 'Critical']),
            'risk_by_module': df.groupby('module')['risk_score'].mean().astype(float).to_dict(),
            'risk_by_priority': df.groupby('priority')['risk_score'].mean().astype(float).to_dict(),
            'uncovered_high_risk': len(df[(df['status'] == 'uncovered') & (df['risk_score'] > 3.0)])
        }
        
        if self.api_key:
            prompt = f"""
            Perform a comprehensive risk assessment:

            RISK METRICS:
            - Overall risk score: {risk_analysis['overall_risk_score']:.2f}
            - High risk items: {risk_analysis['high_risk_items']}
            - Critical impact items: {risk_analysis['critical_impact_items']}
            - Uncovered high risk: {risk_analysis['uncovered_high_risk']}

            Please provide:
            1. Risk categorization and prioritization
            2. Mitigation strategies for each risk level
            3. Business impact analysis
            4. Compliance considerations
            5. Recommended risk monitoring approach
            """
            
            try:
                response = self._call_llm_api(prompt)
                risk_analysis['llm_insights'] = response
            except Exception as e:
                logging.error(f"LLM risk assessment failed: {str(e)}")
        
        return risk_analysis
    
    def _analyze_workflow(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze application workflow and identify endpoints"""
        if not self.api_key:
            return self._fallback_workflow_analysis(df)
        
        context = self._prepare_workflow_context(df, metadata)
        
        prompt = f"""
        Analyze the application workflow and identify all endpoints:

        PROJECT CONTEXT:
        {context}

        Please identify:
        1. All API endpoints and their purposes
        2. User workflows and user journeys
        3. Data flow between components
        4. Integration points
        5. Authentication flows
        6. Business logic flows
        7. Error handling paths
        8. Performance critical paths

        For each endpoint/workflow, provide:
        - Purpose and functionality
        - Input/output specifications
        - Security considerations
        - Test scenarios needed
        """
        
        try:
            response = self._call_llm_api(prompt)
            return {
                'workflow_analysis': response,
                'estimated_endpoints': len(df) * 2,  # Rough estimate
                'user_journeys': self._extract_user_journeys(df)
            }
        except Exception as e:
            logging.error(f"LLM workflow analysis failed: {str(e)}")
            return self._fallback_workflow_analysis(df)
    
    def _analyze_endpoints(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze API endpoints and their test requirements"""
        endpoint_analysis = {
            'total_endpoints': len(df),
            'endpoints_by_module': df.groupby('module').size().astype(int).to_dict(),
            'endpoints_by_priority': df.groupby('priority').size().astype(int).to_dict(),
            'uncovered_endpoints': len(df[df['status'] == 'uncovered']),
            'high_risk_endpoints': len(df[df['risk_score'] > 4.0])
        }
        
        if self.api_key:
            prompt = f"""
            Analyze API endpoints and provide comprehensive test coverage:

            ENDPOINT ANALYSIS:
            - Total endpoints: {endpoint_analysis['total_endpoints']}
            - Uncovered endpoints: {endpoint_analysis['uncovered_endpoints']}
            - High risk endpoints: {endpoint_analysis['high_risk_endpoints']}

            Please provide for each endpoint type:
            1. HTTP method and path
            2. Request/response schemas
            3. Authentication requirements
            4. Input validation rules
            5. Error scenarios
            6. Performance considerations
            7. Security test cases
            8. Integration test scenarios
            """
            
            try:
                response = self._call_llm_api(prompt)
                endpoint_analysis['llm_endpoint_details'] = response
            except Exception as e:
                logging.error(f"LLM endpoint analysis failed: {str(e)}")
        
        return endpoint_analysis
    
    def _generate_summary(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive summary"""
        summary = {
            'total_artifacts': len(df),
            'coverage_percentage': len(df[df['status'] == 'covered']) / len(df) * 100,
            'critical_items': len(df[df['business_impact'] == 'Critical']),
            'high_priority_items': len(df[df['priority'] == 'high']),
            'overall_risk_score': df['risk_score'].mean(),
            'recommended_actions': self._generate_action_items(df)
        }
        
        if self.api_key:
            prompt = f"""
            Generate an executive summary for this coverage analysis:

            KEY METRICS:
            - Total artifacts: {summary['total_artifacts']}
            - Coverage percentage: {summary['coverage_percentage']:.1f}%
            - Critical items: {summary['critical_items']}
            - Overall risk score: {summary['overall_risk_score']:.2f}

            Please provide:
            1. Executive summary
            2. Key findings and insights
            3. Critical risks and recommendations
            4. Next steps and priorities
            5. Resource requirements
            """
            
            try:
                response = self._call_llm_api(prompt)
                summary['llm_summary'] = response
            except Exception as e:
                logging.error(f"LLM summary generation failed: {str(e)}")
        
        return summary
    
    def _call_llm_api(self, prompt: str) -> str:
        """Call Hugging Face API"""
        if not self.api_key:
            raise Exception("No API key available")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": 1000,
                "temperature": 0.7,
                "do_sample": True
            }
        }
        
        response = requests.post(
            f"{self.base_url}/{self.model_name}",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '')
            return str(result)
        else:
            raise Exception(f"API call failed: {response.status_code} - {response.text}")
    
    def _prepare_security_context(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> str:
        """Prepare context for security analysis"""
        return f"""
        Project contains {metadata.get('total_files', 0)} files with:
        - {metadata.get('dockerfiles', 0)} Dockerfiles
        - {metadata.get('manifests', 0)} dependency manifests
        - {metadata.get('modules', 0)} code modules
        
        Risk distribution: {df['risk_score'].describe().to_dict()}
        Priority distribution: {df['priority'].value_counts().to_dict()}
        Business impact: {df['business_impact'].value_counts().to_dict()}
        """
    
    def _prepare_test_context(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> str:
        """Prepare context for test recommendations"""
        return f"""
        Project structure:
        - {metadata.get('total_files', 0)} total files
        - {metadata.get('modules', 0)} modules
        - {metadata.get('dockerfiles', 0)} Dockerfiles
        
        Coverage status: {df['status'].value_counts().to_dict()}
        Complexity scores: {df['complexity_score'].describe().to_dict()}
        """
    
    def _prepare_workflow_context(self, df: pd.DataFrame, metadata: Dict[str, Any]) -> str:
        """Prepare context for workflow analysis"""
        return f"""
        Application structure:
        - {metadata.get('modules', 0)} modules
        - {metadata.get('total_files', 0)} files
        
        Module distribution: {df['module'].value_counts().to_dict()}
        Priority levels: {df['priority'].value_counts().to_dict()}
        """
    
    def _identify_focus_areas(self, uncovered_df: pd.DataFrame) -> List[str]:
        """Identify areas that need immediate attention"""
        focus_areas = []
        
        # Critical business impact items
        critical_uncovered = uncovered_df[uncovered_df['business_impact'] == 'Critical']
        if len(critical_uncovered) > 0:
            focus_areas.append("Critical business impact items")
        
        # High priority items
        high_priority_uncovered = uncovered_df[uncovered_df['priority'] == 'high']
        if len(high_priority_uncovered) > 0:
            focus_areas.append("High priority items")
        
        # High risk items
        high_risk_uncovered = uncovered_df[uncovered_df['risk_score'] > 4.0]
        if len(high_risk_uncovered) > 0:
            focus_areas.append("High risk items")
        
        return focus_areas
    
    def _identify_automation_opportunities(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Identify opportunities for test automation"""
        return {
            'high_priority_automation': len(df[df['priority'] == 'high']),
            'repetitive_testing': len(df[df['complexity_score'] > 3.0]),
            'api_testing': len(df[df['name'].str.contains('api', case=False, na=False)]),
            'ui_testing': len(df[df['name'].str.contains('ui|frontend', case=False, na=False)])
        }
    
    def _extract_user_journeys(self, df: pd.DataFrame) -> List[str]:
        """Extract potential user journeys from the data"""
        journeys = []
        modules = df['module'].unique()
        
        for module in modules:
            if any(keyword in module.lower() for keyword in ['auth', 'login', 'user']):
                journeys.append(f"User Authentication Flow - {module}")
            if any(keyword in module.lower() for keyword in ['payment', 'checkout', 'order']):
                journeys.append(f"Payment/Checkout Flow - {module}")
            if any(keyword in module.lower() for keyword in ['product', 'catalog', 'search']):
                journeys.append(f"Product Browsing Flow - {module}")
        
        return journeys
    
    def _generate_action_items(self, df: pd.DataFrame) -> List[str]:
        """Generate actionable items"""
        actions = []
        
        uncovered = df[df['status'] == 'uncovered']
        if len(uncovered) > 0:
            actions.append(f"Address {len(uncovered)} uncovered items")
        
        high_risk = df[df['risk_score'] > 4.0]
        if len(high_risk) > 0:
            actions.append(f"Mitigate {len(high_risk)} high-risk items")
        
        critical = df[df['business_impact'] == 'Critical']
        if len(critical) > 0:
            actions.append(f"Prioritize {len(critical)} critical business impact items")
        
        return actions
    
    def _get_dataset_stats(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Get dataset statistics"""
        return {
            'total_rows': len(df),
            'columns': list(df.columns),
            'missing_values': df.isnull().sum().astype(int).to_dict(),
            'data_types': {col: str(dtype) for col, dtype in df.dtypes.to_dict().items()}
        }
    
    # Fallback methods when LLM is not available
    def _fallback_security_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Fallback security analysis without LLM"""
        return {
            'analysis': 'Security analysis requires LLM API key',
            'vulnerability_count': len(df[df['risk_score'] > 3.0]),
            'high_risk_items': df[df['risk_score'] > 4.0].to_dict('records')
        }
    
    def _fallback_test_recommendations(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Fallback test recommendations without LLM"""
        return {
            'recommendations': 'Test recommendations require LLM API key',
            'test_case_count': len(df) * 3,
            'automation_opportunities': self._identify_automation_opportunities(df)
        }
    
    def _fallback_workflow_analysis(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Fallback workflow analysis without LLM"""
        return {
            'workflow_analysis': 'Workflow analysis requires LLM API key',
            'estimated_endpoints': len(df) * 2,
            'user_journeys': self._extract_user_journeys(df)
        }
