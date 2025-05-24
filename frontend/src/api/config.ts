import { LOCAL_IP } from '../../../local.config';

// Environment detection
const isDevelopment = import.meta.env.DEV;

// API Configuration
export const API_CONFIG = {
  DEVELOPMENT_URL: `http://${LOCAL_IP}:8008`,

  PRODUCTION_URL: import.meta.env.API_URL,

  // Current base URL based on environment
  get BASE_URL() {
    return isDevelopment ? this.DEVELOPMENT_URL : this.PRODUCTION_URL;
  },
};

export const BASE_URL = API_CONFIG.BASE_URL;

// Helper functions
export const getApiUrl = (endpoint: string = '') => {
  return `${BASE_URL}${endpoint}`;
};

if (isDevelopment) {
  console.log('API Configuration:', {
    environment: process.env.NODE_ENV || 'development',
    baseUrl: BASE_URL,
  });
}
