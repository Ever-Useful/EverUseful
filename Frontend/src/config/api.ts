// API Configuration
// This application uses IAM roles for AWS authentication in production

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Simple API URL configuration
export const getApiUrl = (endpoint: string) => {
  // Use localhost for development, api.amoghconnect.com for production
  const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://api.amoghconnect.com';
  const url = `${baseUrl}${endpoint}`;
  return url;
};

// API Endpoints - Lazy evaluation to avoid logging on import
export const API_ENDPOINTS = {
  // Base URL for direct use
  get BASE_URL() { return isDevelopment ? 'http://localhost:3000' : 'https://api.amoghconnect.com'; },
  
  // Auth endpoints
  get TOKEN() { return getApiUrl('/token'); },
  
  // User endpoints
  get USERS() { return getApiUrl('/api/users'); },
  get USER_PROFILE() { return getApiUrl('/api/users/profile'); },
  get USER_SKILLS() { return getApiUrl('/api/users/skills'); },
  get USER_PROJECTS() { return getApiUrl('/api/users/projects'); },
  get USER_CART() { return getApiUrl('/api/users/cart'); },
  get USER_MEETINGS() { return getApiUrl('/api/users/meetings'); },
  get USER_CONNECTIONS() { return getApiUrl('/api/users/connections'); },
  USER_BY_ID: (id: string) => getApiUrl(`/api/users/${id}`),
  USER_BULK: (ids: string) => getApiUrl(`/api/users/bulk/${ids}`),
  get USER_FOLLOW() { return getApiUrl('/api/users/follow'); },
  
  // Phone verification endpoints
  get VERIFY_PHONE() { return getApiUrl('/api/users/verify-phone'); },
  get RESEND_PHONE_VERIFICATION() { return getApiUrl('/api/users/resend-phone-verification'); },
  get VERIFY_EMAIL() { return getApiUrl('/api/users/verify-email'); },
  
  // S3 endpoints
  get S3_UPLOAD_PROFILE_IMAGE() { return getApiUrl('/api/s3/upload-profile-image'); },
  get S3_UPLOAD_PROJECT_IMAGES() { return getApiUrl('/api/s3/upload-project-images'); },
  get S3_DELETE_IMAGE() { return getApiUrl('/api/s3/delete-image'); },
  get S3_LIST_USER_IMAGES() { return getApiUrl('/api/s3/list-user-images'); },
  get S3_SIGNED_URL() { return getApiUrl('/api/s3/signed-url'); },
  get S3_CREATE_USER_FOLDER() { return getApiUrl('/api/s3/create-user-folder'); },
  
  // Marketplace endpoints
  get MARKETPLACE() { return getApiUrl('/api/marketplace'); },
  get MARKETPLACE_PROJECTS() { return getApiUrl('/api/marketplace/projects'); },
  MARKETPLACE_PROJECT: (id: string) => getApiUrl(`/api/marketplace/projects/${id}`),
  MARKETPLACE_VIEWS: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/views`),
  MARKETPLACE_FAVORITE: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/favorite`),
  MARKETPLACE_VIEW: (id: string) => getApiUrl(`/api/marketplace/projects/${id}/view`),
  
  // Dashboard endpoints
  get DASHBOARD() { return getApiUrl('/api/dashboarddata'); },
  
  // Admin endpoints
  get ADMIN() { return getApiUrl('/api/admin'); },
  get ADMIN_OVERVIEW() { return getApiUrl('/api/admin/overview'); },
  
  // Health check
  get HEALTH() { return getApiUrl('/api/test'); },
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
  
  // Only log actual API requests, not endpoint definitions
  if (isDevelopment) {
    console.log(`API Request: ${endpoint} (development)`);
  }
  
  return fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}; 