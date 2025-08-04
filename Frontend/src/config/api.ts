// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Base API URL - automatically switches between localhost and production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isDevelopment ? 'http://localhost:3000' : 'http://13.235.148.91:3000');

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  TOKEN: `${API_BASE_URL}/token`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
  USER_SKILLS: `${API_BASE_URL}/api/users/skills`,
  USER_PROJECTS: `${API_BASE_URL}/api/users/projects`,
  USER_CART: `${API_BASE_URL}/api/users/cart`,
  USER_MEETINGS: `${API_BASE_URL}/api/users/meetings`,
  USER_CONNECTIONS: `${API_BASE_URL}/api/users/connections`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  USER_BULK: (ids: string) => `${API_BASE_URL}/api/users/bulk/${ids}`,
  USER_FOLLOW: `${API_BASE_URL}/api/users/follow`,
  
  // Marketplace endpoints
  MARKETPLACE: `${API_BASE_URL}/api/marketplace`,
  MARKETPLACE_PROJECTS: `${API_BASE_URL}/api/marketplace/projects`,
  MARKETPLACE_PROJECT: (id: string) => `${API_BASE_URL}/api/marketplace/projects/${id}`,
  MARKETPLACE_VIEWS: (id: string) => `${API_BASE_URL}/api/marketplace/projects/${id}/views`,
  MARKETPLACE_FAVORITE: (id: string) => `${API_BASE_URL}/api/marketplace/projects/${id}/favorite`,
  MARKETPLACE_VIEW: (id: string) => `${API_BASE_URL}/api/marketplace/projects/${id}/view`,
  
  // Dashboard endpoints
  DASHBOARD: `${API_BASE_URL}/api/dashboarddata`,
  
  // Admin endpoints
  ADMIN: `${API_BASE_URL}/api/admin`,
  ADMIN_OVERVIEW: `${API_BASE_URL}/api/admin/overview`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/test`,
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