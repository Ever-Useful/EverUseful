// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Base API URL - automatically switches between localhost and production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://localhost:3000' : 'https://amoghconnect.com');

// For production, we need to ensure the API calls go through the proxy
export const getApiUrl = (endpoint: string) => {
  if (isDevelopment) {
    return `${API_BASE_URL}${endpoint}`;
  } else {
    // In production, use the backend directly with HTTP
    // Users will need to allow mixed content in their browser
    return `http://13.235.148.91:3000${endpoint}`;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  TOKEN: getApiUrl('/token'),
  
  // User endpoints
  USERS: getApiUrl('/api/users'),
  USER_PROFILE: getApiUrl('/api/users/profile'),
  USER_SKILLS: getApiUrl('/api/users/skills'),
  USER_PROJECTS: getApiUrl('/api/users/projects'),
  USER_CART: getApiUrl('/api/users/cart'),
  USER_MEETINGS: getApiUrl('/api/users/meetings'),
  USER_CONNECTIONS: getApiUrl('/api/users/connections'),
  USER_BY_ID: (id: string) => getApiUrl(`/api/users/${id}`),
  USER_BULK: (ids: string) => getApiUrl(`/api/users/bulk/${ids}`),
  USER_FOLLOW: getApiUrl('/api/users/follow'),
  
  // Marketplace endpoints
  MARKETPLACE: getApiUrl('/api/marketplace'),
  MARKETPLACE_PROJECTS: getApiUrl('/api/marketplace/projects'),
  MARKETPLACE_PROJECT: (id: string) => getApiUrl(`/api/marketplace/projects/${id}`),
  MARKETPLACE_VIEWS: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/views`),
  MARKETPLACE_FAVORITE: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/favorite`),
  MARKETPLACE_VIEW: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/view`),
  
  // Dashboard endpoints
  DASHBOARD: getApiUrl('/api/dashboarddata'),
  
  // Admin endpoints
  ADMIN: getApiUrl('/api/admin'),
  ADMIN_OVERVIEW: getApiUrl('/api/admin/overview'),
  
  // Health check
  HEALTH: getApiUrl('/api/test'),
};

// Helper function to get auth headers
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  // This will be implemented based on your auth system
  return {
    'Content-Type': 'application/json',
    // Add any other default headers here
  };
};

// Helper function to make authenticated requests
export const makeAuthenticatedRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const headers = await getAuthHeaders();
  
  return fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
};

// Environment info for debugging
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  isDevelopment,
  isProduction,
  endpoints: API_ENDPOINTS,
}; 