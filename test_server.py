#!/usr/bin/env python3
"""
Quick server test script
"""
import requests
import time
import json

def test_server():
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Coverage Framework API...")
    print(f"📡 Base URL: {base_url}")
    
    # Wait a moment for server to be ready
    time.sleep(2)
    
    endpoints_to_test = [
        "/api/coverage/overall",
        "/api/coverage/risk-areas", 
        "/api/coverage/clusters",
        "/api/coverage/recommendations",
        "/api/ml/models/info",
        "/api/ml/comprehensive-analysis"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            print(f"\n🔍 Testing: {endpoint}")
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            
            if response.status_code == 200:
                print(f"✅ SUCCESS - Status: {response.status_code}")
                data = response.json()
                if 'error' in data:
                    print(f"⚠️  API Error: {data['error']}")
                else:
                    print(f"📊 Response keys: {list(data.keys())}")
                    
                    # Special checks for ML models
                    if 'models/info' in endpoint:
                        models = data.get('model_info', {}).get('models_loaded', [])
                        print(f"🤖 Loaded models: {models}")
                    elif 'risk-areas' in endpoint:
                        risk_count = data.get('total_risk_areas', 0)
                        print(f"⚠️  Risk areas found: {risk_count}")
                    elif 'clusters' in endpoint:
                        cluster_count = data.get('total_clusters', 0)
                        print(f"🔢 Clusters found: {cluster_count}")
                        
            else:
                print(f"❌ FAILED - Status: {response.status_code}")
                print(f"📝 Response: {response.text[:200]}...")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ CONNECTION ERROR - Server not running on {base_url}")
            break
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
    
    print("\n" + "="*60)
    print("🎯 POSTMAN READY URLS:")
    for endpoint in endpoints_to_test:
        print(f"   GET {base_url}{endpoint}")
    print("="*60)

if __name__ == "__main__":
    test_server()

