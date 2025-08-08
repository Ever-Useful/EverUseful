// API Configuration
// This application uses IAM roles for AWS authentication in production

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Simple API URL configuration
export const getApiUrl = (endpoint: string) => {
  // Use localhost for development, api.amoghconnect.com for production
  const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://api.amoghconnect.com';
  const url = `${baseUrl}${endpoint}`;
  console.log(`API Request: ${url} (${isDevelopment ? 'development' : 'production'})`);
  return url;
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
  return {
    'Content-Type': 'application/json',
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