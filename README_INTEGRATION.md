# 🔗 Frontend-Backend Integration Guide

## 🚀 **INTEGRATION COMPLETE!**

Your Coverage Testing Framework now has **full-stack integration** between your Next.js frontend and Flask backend with ML models!

---

## 📁 **Project Structure**

```
coverage_testing/
├── 📁 backend/                 # Flask API + ML Models
│   ├── 📁 app/
│   │   ├── ml_model_manager.py # PKL model handler
│   │   ├── routes.py           # 25+ API endpoints
│   │   └── ...
│   └── run.py                  # Backend server
├── 📁 frontend/                # Next.js Frontend
│   └── 📁 coverage-testinglol-main/
│       ├── 📁 components/
│       │   └── ml-integration/ # ML dashboard components
│       ├── 📁 hooks/
│       │   └── use-coverage-data.ts # API integration hooks
│       ├── 📁 lib/
│       │   └── api.ts          # API client
│       └── package.json
├── 📁 data/                    # Your PKL models
│   ├── decision_tree.pkl
│   ├── random_forest.pkl
│   ├── xgboost.pkl
│   ├── kmeans_model.pkl
│   ├── scaler.pkl
│   └── label_encoder.pkl
└── start-fullstack.py         # Start both servers
```

---

## 🚀 **How to Start Full-Stack Application**

### **Option 1: One-Command Startup** ⚡
```bash
python start-fullstack.py
```

### **Option 2: Manual Startup** 🛠️

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/coverage-testinglol-main
npm install    # First time only
npm run dev
```

---

## 🌐 **Access Your Application**

- **🎨 Frontend**: http://localhost:3000
- **📊 Backend API**: http://localhost:5000/api
- **🧪 API Testing**: Use Postman with provided collection

---

## 🔗 **Integration Features**

### **✅ What's Integrated:**

1. **🤖 ML Model Integration**
   - Real-time PKL model predictions
   - Risk analysis dashboard
   - Feature clustering visualization
   - Model performance metrics

2. **📊 API Integration**
   - 25+ backend endpoints connected
   - React hooks for data fetching
   - Error handling and loading states
   - Real-time data updates

3. **🎨 UI Components**
   - ML Dashboard component
   - Coverage visualization charts
   - Risk area displays
   - Cluster analysis views

4. **⚙️ Configuration**
   - Environment setup
   - CORS configuration
   - TypeScript types
   - Error boundaries

---

## 🔧 **API Integration Details**

### **Key Files:**

1. **`lib/api.ts`** - Complete API client
   - All 25+ endpoint functions
   - TypeScript interfaces
   - Error handling
   - Request/response types

2. **`hooks/use-coverage-data.ts`** - React hooks
   - `useComprehensiveAnalysis()`
   - `useRiskAreas()`
   - `useClusters()`
   - `useRiskPrediction()`
   - `useDashboardData()`

3. **`components/ml-integration/ml-dashboard.tsx`** - ML UI
   - Real-time model data
   - Performance metrics
   - Risk visualization
   - Cluster displays

---

## 🎯 **Available Endpoints**

### **Coverage Analysis:**
- `GET /api/coverage/overall`
- `GET /api/coverage/risk-areas`
- `GET /api/coverage/clusters`
- `GET /api/coverage/recommendations`

### **ML Models:**
- `GET /api/ml/models/info`
- `POST /api/ml/predict/risk`
- `GET /api/ml/comprehensive-analysis`
- `GET /api/ml/recommend/enhanced`

### **Project Management:**
- `GET /api/projects`
- `GET /api/projects/{id}/features`
- `POST /api/projects/{id}/coverage/calculate`

---

## 🎨 **Frontend Usage Examples**

### **1. Display Coverage Data:**
```tsx
import { useComprehensiveAnalysis } from '@/hooks/use-coverage-data';

function CoverageDisplay() {
  const { data, loading, error } = useComprehensiveAnalysis();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Coverage: {data?.overall_functional_coverage_index}</h2>
      {/* Display your ML model results */}
    </div>
  );
}
```

### **2. Risk Prediction:**
```tsx
import { useRiskPrediction } from '@/hooks/use-coverage-data';

function RiskPredictor() {
  const { predictRisk, prediction, loading } = useRiskPrediction();
  
  const handlePredict = () => {
    predictRisk({
      name: "Payment System",
      priority: "high",
      complexity: "high",
      business_impact: "critical",
      risk_score: 5,
      status: "uncovered",
      coverage_percentage: 0
    }, "xgboost");
  };
  
  return (
    <div>
      <button onClick={handlePredict}>Predict Risk</button>
      {prediction && (
        <p>Risk Level: {prediction.predicted_risk_level}</p>
      )}
    </div>
  );
}
```

### **3. ML Dashboard:**
```tsx
import MLDashboard from '@/components/ml-integration/ml-dashboard';

function App() {
  return (
    <div>
      <h1>Coverage Testing Framework</h1>
      <MLDashboard />
    </div>
  );
}
```

---

## 🛠️ **Configuration**

### **Environment Variables:**
Create `.env.local` in frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENABLE_ML_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_CLUSTERING=true
```

### **CORS Configuration:**
Backend automatically configured for:
- `http://localhost:3000` (Next.js dev)
- `http://127.0.0.1:3000` (Alternative)
- All origins (for testing)

---

## 🔍 **Testing Integration**

### **1. Test Backend API:**
```bash
curl http://localhost:5000/api/ml/models/info
curl http://localhost:5000/api/coverage/overall
```

### **2. Test Frontend:**
- Navigate to http://localhost:3000
- Check browser console for API calls
- Verify data loading in components

### **3. Test ML Integration:**
- Open ML Dashboard page
- Verify PKL model data displays
- Check real-time updates

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Check backend CORS configuration
   - Verify frontend URL in backend settings

2. **API Connection Failed:**
   - Ensure backend is running on port 5000
   - Check firewall settings
   - Verify API_URL in frontend config

3. **ML Models Not Loading:**
   - Check PKL files in data/ directory
   - Verify Python dependencies installed
   - Check backend logs for errors

4. **Frontend Build Errors:**
   - Run `npm install` in frontend directory
   - Check TypeScript errors
   - Verify all imports are correct

---

## 🎉 **SUCCESS! Your Full-Stack Integration is Complete!**

### **What You Have Now:**
✅ **Next.js Frontend** with TypeScript  
✅ **Flask Backend** with 25+ API endpoints  
✅ **6 ML Models** (PKL files) fully integrated  
✅ **Real-time Data** flow between frontend/backend  
✅ **Professional UI** with charts and dashboards  
✅ **Error Handling** and loading states  
✅ **Type Safety** with TypeScript interfaces  
✅ **Production Ready** architecture  

**Your coverage testing framework is now a complete, professional-grade application!** 🚀
