import { auth } from '../lib/firebase';

const API_BASE_URL = 'http://localhost:3000/api/users';

interface UserProfile {
  avatar: string;
  bio: string;
  location: string;
  website: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  projectsCount: number;
  totalLikes: number;
  totalViews: number;
  totalDownloads: number;
  memberSince: string;
  points: number;
}

interface UserData {
  customUserId: string;
  profile: UserProfile;
  stats: UserStats;
  studentData?: {
    college: string | null;
    degree: string | null;
    course: string | null;
    year: string | null;
    updatedAt: string;
  } | null;
}

interface Project {
  projectId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  projectLink: string;
  githubLink: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  downloads: number;
}

interface Skill {
  name: string;
  category: string;
  expertise: string;
  addedAt: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
  quantity: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata: any;
}

class UserService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Create new user
  async createUser(userData: Partial<UserProfile>): Promise<UserData> {
    const response = await this.makeRequest('/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  // Get user profile (returns both auth and profile info)
  async getUserProfile(): Promise<{ customUserId: string; auth: any; profile: any; stats: any; studentData?: any }> {
    const response = await this.makeRequest('/profile');
    return response.data;
  }

  // Get user by custom ID (public profile)
  async getUserByCustomId(customUserId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/${customUserId}`);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return response.json();
  }

  // Update user profile (extended info in userData.json)
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  }

  // Add project
  async addProject(projectData: Partial<Project>): Promise<Project> {
    const response = await this.makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response.data;
  }

  // Get user projects
  async getUserProjects(): Promise<{
    created: Project[];
    collaborated: Project[];
    favorites: Project[];
    count: number;
  }> {
    const response = await this.makeRequest('/projects');
    return response.data;
  }

  // Add skill
  async addSkill(skillData: Partial<Skill> & { customUserId?: string }): Promise<Skill> {
    const response = await this.makeRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
    return response.data;
  }

  // Remove skill
  async deleteSkill(skillName: string): Promise<void> {
    const response = await this.makeRequest(`/skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  // Get user skills
  async getUserSkills(): Promise<string[]> {
    const response = await this.makeRequest('/skills');
    return response.data || [];
  }

  // Debug method to check current user status
  async debugCurrentUser(): Promise<any> {
    const response = await this.makeRequest('/debug/current-user');
    return response.data;
  }

  // Add to cart
  async addToCart(customUserId: string, productData: Partial<CartItem>): Promise<CartItem[]> {
    const response = await this.makeRequest(`/${customUserId}/cart`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data;
  }

  // Get user cart
  async getUserCart(): Promise<CartItem[]> {
    const response = await this.makeRequest('/cart');
    return response.data;
  }

  // Get user cart (by customUserId)
  async getUserCartByCustomId(customUserId: string): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/${customUserId}/cart`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    return data.data;
  }

  // Remove from cart
  async removeFromCart(customUserId: string, productId: string): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/${customUserId}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    const data = await response.json();
    return data.data;
  }

  // Clear cart
  async clearCart(customUserId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${customUserId}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  }

  // Add activity
  async addActivity(activityData: Partial<Activity>): Promise<Activity> {
    const response = await this.makeRequest('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return response.data;
  }

  // Get user activities
  async getUserActivities(): Promise<{
    recent: Activity[];
    achievements: any[];
    badges: any[];
    points: number;
  }> {
    const response = await this.makeRequest('/activities');
    return response.data;
  }

  // Follow user
  async followUser(targetUserId: string): Promise<{
    followersCount: number;
    followingCount: number;
  }> {
    const response = await this.makeRequest(`/follow/${targetUserId}`, {
      method: 'POST',
    });
    return response.data;
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    const response = await this.makeRequest('/stats');
    return response.data;
  }

  // Get user followers/following
  async getSocialData(type: 'followers' | 'following'): Promise<{
    users: any[];
    count: number;
  }> {
    const response = await this.makeRequest(`/social/${type}`);
    return response.data;
  }

  // Check if user exists and create if not
  async ensureUserExists(userData: Partial<UserProfile>): Promise<UserData> {
    try {
      // Try to get existing user
      return await this.getUserProfile();
    } catch (error) {
      // User doesn't exist, create new user
      return await this.createUser(userData);
    }
  }

  // Get current user's custom ID
  async getCurrentUserId(): Promise<string> {
    const userData = await this.getUserProfile();
    return userData.customUserId;
  }

  // Update user (by customUserId)
  async updateUser(customUserId: string, userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/${customUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  }

  // Update user auth info (Firestore fields)
  async updateAuthInfo(authData: Partial<{ firstName: string; lastName: string; phoneNumber: string; userType: string }>): Promise<void> {
    await this.makeRequest('/auth', {
      method: 'PUT',
      body: JSON.stringify(authData),
    });
  }
}

export const userService = new UserService();
export default userService; 