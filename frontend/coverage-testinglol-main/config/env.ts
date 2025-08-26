// Environment Configuration
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENV || 'development',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  
  // Polling intervals
  COVERAGE_POLL_INTERVAL: parseInt(process.env.NEXT_PUBLIC_COVERAGE_POLL_INTERVAL || '30000'),
  DASHBOARD_REFRESH_INTERVAL: parseInt(process.env.NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL || '60000'),
  
  // Feature flags
  ENABLE_REAL_TIME: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === 'true',
  ENABLE_ML_PREDICTIONS: process.env.NEXT_PUBLIC_ENABLE_ML_PREDICTIONS !== 'false',
  ENABLE_CLUSTERING: process.env.NEXT_PUBLIC_ENABLE_CLUSTERING !== 'false',
  
  // Chart settings
  CHART_ANIMATION_DURATION: parseInt(process.env.NEXT_PUBLIC_CHART_ANIMATION_DURATION || '1000'),
  MAX_CHART_DATA_POINTS: parseInt(process.env.NEXT_PUBLIC_MAX_CHART_DATA_POINTS || '100'),
};
