# Functional Test Coverage Measurement Framework - Backend

A comprehensive 5-dimensional coverage analysis backend built with Flask and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL
- Redis (optional, for background tasks)

### Installation

1. **Navigate to backend directory:**
```bash
cd coverage_testing/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Setup database:**
```bash
# Create PostgreSQL database
createdb coverage_db

# Initialize tables and sample data
python setup.py
```

5. **Start the application:**
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## 📊 Coverage Dimensions

The framework measures coverage across 5 critical dimensions:

### 1. **Functional Coverage (CF)**
- Formula: `CF = (Tested_Features / Total_Features) × 100`
- Tracks feature/requirement coverage

### 2. **Data Coverage (CD)**  
- Formula: `CD = (Σ(Boundary_Tests + Equivalence_Tests + Error_Tests) / Total_Data_Scenarios) × 100`
- Measures input variations and edge cases

### 3. **User Journey Coverage (CJ)**
- Formula: `CJ = (Critical_Paths_Tested / Total_Critical_Paths) × 100`
- End-to-end scenario coverage

### 4. **Risk Coverage (CR)**
- Formula: `CR = Σ(Business_Impact × Test_Completeness) / Total_Risk_Scenarios`
- Business-critical path coverage

### 5. **Environmental Coverage (CE)**
- Formula: `CE = (Tested_Environments / Required_Environments) × 100`
- Cross-platform/browser testing

### **Total Coverage Score**
```
Total Score = Σ(Wi × Ci × Ri)
Where: Wi = Weight, Ci = Coverage %, Ri = Risk factor
```

## 🔧 API Endpoints

### Project Management
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}/weights` - Update dimension weights

### Feature Management
- `GET /api/projects/{id}/features` - Get project features
- `POST /api/projects/{id}/features` - Create feature
- `PUT /api/features/{id}` - Update feature

### Coverage Analysis
- `POST /api/projects/{id}/coverage/calculate` - Calculate coverage scores
- `GET /api/projects/{id}/coverage/latest` - Get latest coverage report
- `GET /api/projects/{id}/coverage/history` - Coverage trends

### Gap Analysis & Recommendations
- `POST /api/projects/{id}/gaps/analyze` - Perform gap analysis
- `POST /api/projects/{id}/recommendations/generate` - Generate AI recommendations
- `GET /api/projects/{id}/recommendations` - Get recommendations

### Dashboard
- `GET /api/projects/{id}/dashboard` - Get comprehensive dashboard data

### Global Coverage Analysis
- `GET /api/coverage/overall` - Get overall coverage percentage across all projects
- `GET /api/coverage/risk-areas` - Get functions/features predicted as "uncovered" with high risk
- `GET /api/coverage/clusters` - Get ML-based feature clusters grouped by characteristics
- `GET /api/coverage/recommendations` - Get intelligent testing recommendations for high-priority uncovered functions

### ML Model Integration (PKL Models)
- `GET /api/ml/models/info` - Get information about loaded pre-trained ML models
- `POST /api/ml/predict/risk` - Predict feature risk using pre-trained ML models
- `POST /api/ml/cluster/features` - Cluster features using pre-trained K-means model
- `GET /api/ml/recommend/enhanced` - Get enhanced recommendations using ensemble of ML models
- `GET /api/ml/analyze/project/{id}` - Comprehensive ML analysis of a project

## 🤖 AI-Powered Features

### ML Recommendation Engine
- **Pattern Detection**: Uses K-means clustering to identify similar features
- **Risk Scoring**: Multi-factor risk assessment with ML enhancement
- **Priority Calculation**: Intelligent prioritization based on business impact
- **Effort Estimation**: Automated effort estimation for testing tasks

### Gap Detection
- **Feature Gaps**: Uncovered or partially covered features
- **Boundary Gaps**: Missing edge case testing
- **Integration Gaps**: Untested component interactions
- **Journey Gaps**: Incomplete critical user paths

## 📈 Mathematical Models

### Risk Matrix
| Business Impact | High Complexity | Medium Complexity | Low Complexity |
|----------------|----------------|-------------------|----------------|
| **Critical** | Weight: 5 | Weight: 4 | Weight: 3 |
| **High** | Weight: 4 | Weight: 3 | Weight: 2 |
| **Medium** | Weight: 3 | Weight: 2 | Weight: 1 |

### Coverage Calculation
```python
# Functional Coverage
CF = (tested_features / total_features) * 100

# Risk-Adjusted Score
risk_multiplier = 0.8 + (0.4 * high_risk_coverage)
final_score = total_score * risk_multiplier
```

## 🗄️ Database Schema

### Core Tables
- **projects**: Project configuration and weights
- **features**: Feature definitions with risk scores
- **test_cases**: Test execution tracking
- **user_journeys**: Critical path definitions
- **environments**: Testing environment matrix
- **coverage_reports**: Historical coverage data
- **recommendations**: AI-generated recommendations

## 🔍 Sample API Usage

### Create a Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Platform",
    "description": "Online shopping application",
    "functional_weight": 0.3,
    "data_weight": 0.2,
    "journey_weight": 0.3,
    "risk_weight": 0.15,
    "environmental_weight": 0.05
  }'
```

### Add a Feature
```bash
curl -X POST http://localhost:5000/api/projects/1/features \
  -H "Content-Type: application/json" \
  -d '{
    "feature_id": "CHECKOUT-001",
    "name": "Shopping Cart Checkout",
    "priority": "high",
    "complexity": "high", 
    "business_impact": "critical",
    "risk_score": 5,
    "status": "uncovered"
  }'
```

### Calculate Coverage
```bash
curl -X POST http://localhost:5000/api/projects/1/coverage/calculate
```

### Generate Recommendations
```bash
curl -X POST http://localhost:5000/api/projects/1/recommendations/generate
```

### Get Overall Coverage
```bash
curl http://localhost:5000/api/coverage/overall
```

### Get High-Risk Areas
```bash
# All projects
curl http://localhost:5000/api/coverage/risk-areas

# Specific project
curl http://localhost:5000/api/coverage/risk-areas?project_id=1
```

### Get Feature Clusters
```bash
# All projects
curl http://localhost:5000/api/coverage/clusters

# Specific project
curl http://localhost:5000/api/coverage/clusters?project_id=1
```

### Get Testing Recommendations
```bash
# Top 10 recommendations (default)
curl http://localhost:5000/api/coverage/recommendations

# Top 5 recommendations for specific project
curl http://localhost:5000/api/coverage/recommendations?project_id=1&limit=5
```

### ML Model Information
```bash
curl http://localhost:5000/api/ml/models/info
```

### Predict Feature Risk with ML
```bash
curl -X POST http://localhost:5000/api/ml/predict/risk \
  -H "Content-Type: application/json" \
  -d '{
    "feature_data": {
      "name": "Payment Processing",
      "priority": "high",
      "complexity": "high", 
      "business_impact": "critical",
      "risk_score": 4,
      "status": "uncovered",
      "coverage_percentage": 0
    },
    "model": "random_forest"
  }'
```

### ML-Based Feature Clustering
```bash
curl -X POST http://localhost:5000/api/ml/cluster/features \
  -H "Content-Type: application/json" \
  -d '{"project_id": 1}'
```

### Enhanced ML Recommendations
```bash
# Get enhanced recommendations using ensemble models
curl http://localhost:5000/api/ml/recommend/enhanced?project_id=1&limit=10

# All projects with ensemble prediction
curl http://localhost:5000/api/ml/recommend/enhanced?ensemble=true&limit=15
```

### Comprehensive Project Analysis
```bash
curl http://localhost:5000/api/ml/analyze/project/1
```

## 🛠️ Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@localhost/coverage_db
SECRET_KEY=your-secret-key
FLASK_ENV=development
REDIS_URL=redis://localhost:6379/0
```

### Dimension Weights (customizable per project)
- Functional: 25% (default)
- Data: 20% (default)
- Journey: 25% (default)
- Risk: 20% (default)
- Environmental: 10% (default)

## 🧪 Testing

```bash
# Run setup to create sample data
python setup.py

# Test API endpoints
curl http://localhost:5000/api/projects
```

## 📚 Architecture

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── models.py            # SQLAlchemy models
│   ├── routes.py            # API endpoints
│   ├── utils.py             # Coverage calculations
│   └── ml_engine.py         # AI recommendations
├── config.py                # Configuration
├── run.py                   # Application entry point
├── setup.py                 # Database initialization
└── requirements.txt         # Dependencies
```

This backend provides a complete foundation for building a sophisticated test coverage measurement and optimization system with AI-powered insights and recommendations.
