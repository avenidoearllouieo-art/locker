import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Flag to prevent multiple redirects
let isRedirecting = false;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 500, // ms
  retryStatusCodes: [408, 429, 500, 502, 503, 504], // Temporary errors
};

// Track retry attempts per request
const retryCount = new WeakMap();

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    // Initialize retry count for this config
    if (!retryCount.has(config)) {
      retryCount.set(config, 0);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and retry logic
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    
    // Only retry GET requests and specific status codes
    if (
      config &&
      error.response &&
      !config.url.includes('/login') &&
      !config.url.includes('/register') &&
      RETRY_CONFIG.retryStatusCodes.includes(error.response.status)
    ) {
      const currentRetry = retryCount.get(config) || 0;
      
      if (currentRetry < RETRY_CONFIG.maxRetries) {
        retryCount.set(config, currentRetry + 1);
        
        // Exponential backoff
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, currentRetry);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(apiClient(config));
          }, delay);
        });
      }
    }
    
    // Only handle 401 errors that indicate true authentication failure
    // Check if token exists AND response is 401 (token might be invalid/expired)
    if (error.response?.status === 401) {
      const token = localStorage.getItem('authToken');
      
      // Only redirect if we have a token but it was rejected (expired/invalid)
      // This prevents false logouts from other 401 errors
      if (token && !isRedirecting) {
        console.warn('Authentication token expired or invalid. Please log in again.');
        isRedirecting = true;
        
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
