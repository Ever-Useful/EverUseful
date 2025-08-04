import { auth } from '../lib/firebase';
import { API_ENDPOINTS, makeAuthenticatedRequest } from '../config/api';

interface UserProfile {
  avatar: string;
  bio: string;
  location: string;
  website: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  gender?: string;
  domain?: string;
  purpose?: string;
  role?: string;
  mobile?: string;
  dateOfBirth?: string;
}

interface UserStats {
  projectsCount: number;
  totalLikes: number;
}

interface UserData {
  success: boolean;
  data: {
    customUserId: string;
    auth: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      userType: string;
      mobile: string;
      gender: string;
      username: string;
    };
    profile: UserProfile;
    stats?: UserStats;
    studentData?: any;
    education?: any[];
    workExperience?: any[];
    skills?: any[];
    freelancerData?: any;
    professorData?: any;
    personalDetails?: any;
    socialLinks?: any;
    projects?: any;
  };
  // Direct properties for backward compatibility
  auth?: any;
  profile?: UserProfile;
  studentData?: any;
  education?: any[];
  workExperience?: any[];
  skills?: any[];
  freelancerData?: any;
  professorData?: any;
  personalDetails?: any;
  socialLinks?: any;
  customUserId?: string;
}

// For backward compatibility with other methods
interface SimpleUserData {
  customUserId: string;
  profile: UserProfile;
  stats?: UserStats;
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'planning' | 'in-progress' | 'completed';
  collaborators: string[];
  createdBy: string;
  createdAt: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Connection {
  id: string;
  userId: string;
  targetUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

class UserService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }

    const token = await user.getIdToken();
    console.log('Auth token retrieved successfully');
    return token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    console.log('Making request to:', endpoint);
    const token = await this.getAuthToken();
    console.log('Token retrieved, making fetch request');
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json();
      console.error('Request failed:', error);
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Create new user
  async createUser(userData: Partial<UserProfile>): Promise<SimpleUserData> {
    const response = await this.makeRequest(API_ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // Get user profile
  async getUserProfile(): Promise<UserData> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_PROFILE);
    
    // Handle both response formats
    if (response.success && response.data) {
      // New format with nested data
      return {
        ...response,
        // Add direct properties for backward compatibility
        auth: response.data.auth,
        profile: response.data.profile,
        studentData: response.data.studentData,
        education: response.data.education,
        workExperience: response.data.workExperience,
        skills: response.data.skills,
        freelancerData: response.data.freelancerData,
        professorData: response.data.professorData,
        personalDetails: response.data.personalDetails,
        socialLinks: response.data.socialLinks,
        customUserId: response.data.customUserId,
      };
    } else {
      // Old format or direct response
      return response;
    }
  }

  // Update user profile
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<SimpleUserData> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  }

  // Get user skills
  async getUserSkills(): Promise<Skill[]> {
    return await this.makeRequest(API_ENDPOINTS.USER_SKILLS);
  }

  // Add user skill
  async addUserSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_SKILLS, {
      method: 'POST',
      body: JSON.stringify(skill),
    });
    return response;
  }

  // Remove user skill
  async removeUserSkill(skillName: string): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USER_SKILLS}/${skillName}`, {
      method: 'DELETE',
    });
  }

  // Get user projects
  async getUserProjects(): Promise<Project[]> {
    return await this.makeRequest(API_ENDPOINTS.USER_PROJECTS);
  }

  // Add user project
  async addUserProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_PROJECTS, {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return response;
  }

  // Get user cart
  async getUserCart(): Promise<CartItem[]> {
    return await this.makeRequest(API_ENDPOINTS.USER_CART);
  }

  // Get user cart by custom ID
  async getUserCartByCustomId(customUserId: string): Promise<CartItem[]> {
    return await this.makeRequest(`${API_ENDPOINTS.USERS}/${customUserId}/cart`);
  }

  // Add item to cart
  async addToCart(item: Omit<CartItem, 'id'>): Promise<CartItem[]> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_CART, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response;
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<CartItem[]> {
    const response = await this.makeRequest(`${API_ENDPOINTS.USER_CART}/${itemId}`, {
      method: 'DELETE',
    });
    return response;
  }

  // Clear cart
  async clearCart(): Promise<void> {
    await this.makeRequest(API_ENDPOINTS.USER_CART, {
      method: 'DELETE',
    });
  }

  // Get user meetings
  async getUserMeetings(): Promise<Meeting[]> {
    return await this.makeRequest(API_ENDPOINTS.USER_MEETINGS);
  }

  // Schedule meeting
  async scheduleMeeting(meeting: Omit<Meeting, 'id' | 'createdAt'>): Promise<Meeting> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_MEETINGS, {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
    return response;
  }

  // Get user connections
  async getUserConnections(): Promise<Connection[]> {
    return await this.makeRequest(API_ENDPOINTS.USER_CONNECTIONS);
  }

  // Send connection request
  async sendConnectionRequest(targetUserId: string): Promise<Connection> {
    const response = await this.makeRequest(API_ENDPOINTS.USER_CONNECTIONS, {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
    return response;
  }

  // Update auth info
  async updateAuthInfo(authData: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/auth`, {
      method: 'PUT',
      body: JSON.stringify(authData),
    });
  }

  // Get all users (admin)
  async getAllUsers(): Promise<SimpleUserData[]> {
    return await this.makeRequest(`${API_ENDPOINTS.USERS}/all`);
  }

  // Get user by custom ID
  async getUserByCustomId(customUserId: string): Promise<SimpleUserData> {
    return await this.makeRequest(`${API_ENDPOINTS.USERS}/custom/${customUserId}`);
  }

  // Add item to cart (alternative method)
  async addItemToCart(productId: string): Promise<any> {
    const response = await this.makeRequest(`${API_ENDPOINTS.USERS}/cart/${productId}`, {
      method: 'POST',
    });
    return response;
  }

  // Get admin overview data
  async getAdminOverview(): Promise<any> {
    return await this.makeRequest(API_ENDPOINTS.ADMIN_OVERVIEW);
  }

  // Update profile (alias for updateUserProfile)
  async updateProfile(profileData: Partial<UserProfile>): Promise<SimpleUserData> {
    return await this.updateUserProfile(profileData);
  }

  // Update student data
  async updateStudentData(studentData: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/student-data`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  // Update freelancer data
  async updateFreelancerData(freelancerData: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/freelancer-data`, {
      method: 'PUT',
      body: JSON.stringify(freelancerData),
    });
  }

  // Update professor data
  async updateProfessorData(professorData: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/professor-data`, {
      method: 'PUT',
      body: JSON.stringify(professorData),
    });
  }

  // Update personal details
  async updatePersonalDetails(personalDetails: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/personal-details`, {
      method: 'PUT',
      body: JSON.stringify(personalDetails),
    });
  }

  // Update social links
  async updateSocialLinks(socialLinks: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/social-links`, {
      method: 'PUT',
      body: JSON.stringify(socialLinks),
    });
  }

  // Add skill (alias for addUserSkill)
  async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    return await this.addUserSkill(skill);
  }

  // Delete skill (alias for removeUserSkill)
  async deleteSkill(skillName: string): Promise<void> {
    return await this.removeUserSkill(skillName);
  }

  // Add education
  async addEducation(education: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/education`, {
      method: 'POST',
      body: JSON.stringify(education),
    });
  }

  // Update education
  async updateEducation(educationId: string, education: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/education/${educationId}`, {
      method: 'PUT',
      body: JSON.stringify(education),
    });
  }

  // Delete education
  async deleteEducation(educationId: string): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/education/${educationId}`, {
      method: 'DELETE',
    });
  }

  // Add work experience
  async addWorkExperience(work: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/work-experience`, {
      method: 'POST',
      body: JSON.stringify(work),
    });
  }

  // Update work experience
  async updateWorkExperience(workId: string, work: any): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/work-experience/${workId}`, {
      method: 'PUT',
      body: JSON.stringify(work),
    });
  }

  // Delete work experience
  async deleteWorkExperience(workId: string): Promise<void> {
    await this.makeRequest(`${API_ENDPOINTS.USERS}/work-experience/${workId}`, {
      method: 'DELETE',
    });
  }
}

export default new UserService(); 