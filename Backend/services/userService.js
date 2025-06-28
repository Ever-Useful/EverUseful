const fs = require('fs').promises;
const path = require('path');

class UserService {
  constructor() {
    this.userDataPath = path.join(__dirname, '../data/userData.json');
    this.userData = null;
  }

  // Load user data from JSON file
  async loadUserData() {
    try {
      const data = await fs.readFile(this.userDataPath, 'utf8');
      this.userData = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, initialize with default structure
      this.userData = {
        users: {},
        userCounter: 0,
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
          description: "User data storage with custom user IDs"
        }
      };
      await this.saveUserData();
    }
  }

  // Save user data to JSON file
  async saveUserData() {
    try {
      this.userData.metadata.lastUpdated = new Date().toISOString();
      await fs.writeFile(this.userDataPath, JSON.stringify(this.userData, null, 2));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  // Generate custom user ID
  async generateCustomUserId() {
    await this.loadUserData();
    // Scan all existing user IDs to find the highest number
    const userIds = Object.keys(this.userData.users || {});
    let maxId = 0;
    userIds.forEach(id => {
      const match = id.match(/^USER_(\d{6})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
    });
    // Ensure userCounter is at least the highest found
    this.userData.userCounter = Math.max(this.userData.userCounter, maxId);
    // Increment for the new user
    this.userData.userCounter += 1;
    const customUserId = `USER_${this.userData.userCounter.toString().padStart(6, '0')}`;
    await this.saveUserData();
    return customUserId;
  }

  // Create new user
  async createUser(firebaseUid, userData) {
    await this.loadUserData();
    
    // Check if user already exists
    const existingUser = this.findUserByFirebaseUid(firebaseUid);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Find the custom user ID that was already generated
    const customUserId = `USER_${this.userData.userCounter.toString().padStart(6, '0')}`;
    
    const newUser = {
      firebaseUid, // Add Firebase UID to link with Firestore
      customUserId,
      profile: {
        avatar: userData.avatar ?? null,
        bio: userData.bio ?? null,
        location: userData.location ?? null,
        website: userData.website ?? null,
        title: userData.title ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: userData.firstName ?? '',
        lastName: userData.lastName ?? '',
        userType: userData.userType ?? 'student',
        username: userData.username ?? '',
        email: userData.email ?? '',
        mobile: userData.mobile ?? userData.phoneNumber ?? '',
        gender: userData.gender ?? '',
        domain: userData.domain ?? '',
        purpose: userData.purpose ?? '',
        role: userData.role ?? '',
      },
      education: [],
      workExperience: [],
      personalDetails: {
        address1: '',
        address2: '',
        landmark: '',
        pincode: '',
        location: '',
        hobbies: '',
        copyCurrent: false,
        updatedAt: new Date().toISOString()
      },
      socialLinks: {
        linkedin: '',
        facebook: '',
        instagram: '',
        twitter: '',
        git: '',
        medium: '',
        reddit: '',
        slack: '',
        dribbble: '',
        behance: '',
        codepen: '',
        figma: '',
        custom: '',
        updatedAt: new Date().toISOString()
      },
      projects: {
        created: [],
        collaborated: [],
        favorites: [],
        count: 0
      },
      marketplace: {
        cart: [],
        orders: [],
        favorites: [],
        reviews: [],
        wishlist: []
      },
      skills: [],
      social: {
        followers: [],
        following: [],
        connections: [],
        followersCount: 0,
        followingCount: 0
      },
      activities: {
        recent: [],
        achievements: [],
        badges: [],
        points: 0
      },
      preferences: {
        notifications: {
          email: null,
          push: null,
          sms: null
        },
        privacy: {
          profileVisibility: null,
          showEmail: null,
          showLocation: null
        },
        theme: null,
        language: null
      },
      stats: {
        projectsCount: 0,
        totalLikes: 0,
        totalViews: 0,
        totalDownloads: 0,
        memberSince: new Date().toISOString()
      },
      studentData: null,
      professorData: null,
      freelancerData: {
        experience: '',
        portfolio: '',
        location: '',
        skills: [],
        hourlyRate: '',
        avgResponseTime: '',
        updatedAt: new Date().toISOString()
      }
    };

    this.userData.users[customUserId] = newUser;
    await this.saveUserData();

    return {
      customUserId,
      profile: newUser.profile
    };
  }

  // Find user by Firebase UID
  findUserByFirebaseUid(firebaseUid) {
    if (!this.userData) return null;
    for (const [customUserId, user] of Object.entries(this.userData.users)) {
      if (user.firebaseUid === firebaseUid) {
        return { customUserId, ...user };
      }
    }
    return null;
  }

  // Find user by custom user ID
  findUserByCustomId(customUserId) {
    console.log('=== findUserByCustomId DEBUGGING ===');
    console.log('Looking for customUserId:', customUserId);
    console.log('userData loaded:', !!this.userData);
    console.log('userData.users:', this.userData ? Object.keys(this.userData.users) : 'No userData');
    console.log('Direct access:', this.userData?.users?.[customUserId] ? 'Found' : 'Not found');
    console.log('=== END findUserByCustomId DEBUGGING ===');
    
    if (!this.userData || !this.userData.users[customUserId]) {
      return null;
    }
    return { customUserId, ...this.userData.users[customUserId] };
  }

  // Update user profile
  async updateUserProfile(customUserId, profileData) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    // Update basic profile fields
    this.userData.users[customUserId].profile = {
      ...this.userData.users[customUserId].profile,
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].profile;
  }

  // Update student data
  async updateStudentData(customUserId, studentData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
        throw new Error('User not found');
    }
    
    if (!this.userData.users[customUserId].studentData) {
        this.userData.users[customUserId].studentData = {};
    }

    this.userData.users[customUserId].studentData = {
        ...this.userData.users[customUserId].studentData,
        ...studentData,
        updatedAt: new Date().toISOString()
    };
    await this.saveUserData();
    return this.userData.users[customUserId].studentData;
  }

  // Update professor data
  async updateProfessorData(customUserId, professorData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
        throw new Error('User not found');
    }
    
    if (!this.userData.users[customUserId].professorData) {
        this.userData.users[customUserId].professorData = {};
    }

    this.userData.users[customUserId].professorData = {
        ...this.userData.users[customUserId].professorData,
        ...professorData,
        updatedAt: new Date().toISOString()
    };
    await this.saveUserData();
    return this.userData.users[customUserId].professorData;
  }

  // Update freelancer data
  async updateFreelancerData(customUserId, freelancerData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
        throw new Error('User not found');
    }
    
    if (!this.userData.users[customUserId].freelancerData) {
        this.userData.users[customUserId].freelancerData = {};
    }

    this.userData.users[customUserId].freelancerData = {
        ...this.userData.users[customUserId].freelancerData,
        ...freelancerData,
        updatedAt: new Date().toISOString()
    };
    await this.saveUserData();
    return this.userData.users[customUserId].freelancerData;
  }

  // Education methods
  async addEducation(customUserId, educationData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    if (!this.userData.users[customUserId].education) {
      this.userData.users[customUserId].education = [];
    }

    const newEducation = {
      id: `edu_${Date.now()}`,
      ...educationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.userData.users[customUserId].education.push(newEducation);
    await this.saveUserData();
    return newEducation;
  }

  async updateEducation(customUserId, educationId, educationData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const educationIndex = this.userData.users[customUserId].education.findIndex(edu => edu.id === educationId);
    if (educationIndex === -1) {
      throw new Error('Education record not found');
    }

    this.userData.users[customUserId].education[educationIndex] = {
      ...this.userData.users[customUserId].education[educationIndex],
      ...educationData,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].education[educationIndex];
  }

  async deleteEducation(customUserId, educationId) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const educationIndex = this.userData.users[customUserId].education.findIndex(edu => edu.id === educationId);
    if (educationIndex === -1) {
      throw new Error('Education record not found');
    }

    this.userData.users[customUserId].education.splice(educationIndex, 1);
    await this.saveUserData();
    return { success: true };
  }

  // Work Experience methods
  async addWorkExperience(customUserId, workData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    if (!this.userData.users[customUserId].workExperience) {
      this.userData.users[customUserId].workExperience = [];
    }

    const newWork = {
      id: `work_${Date.now()}`,
      ...workData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.userData.users[customUserId].workExperience.push(newWork);
    await this.saveUserData();
    return newWork;
  }

  async updateWorkExperience(customUserId, workId, workData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const workIndex = this.userData.users[customUserId].workExperience.findIndex(work => work.id === workId);
    if (workIndex === -1) {
      throw new Error('Work experience record not found');
    }

    this.userData.users[customUserId].workExperience[workIndex] = {
      ...this.userData.users[customUserId].workExperience[workIndex],
      ...workData,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].workExperience[workIndex];
  }

  async deleteWorkExperience(customUserId, workId) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const workIndex = this.userData.users[customUserId].workExperience.findIndex(work => work.id === workId);
    if (workIndex === -1) {
      throw new Error('Work experience record not found');
    }

    this.userData.users[customUserId].workExperience.splice(workIndex, 1);
    await this.saveUserData();
    return { success: true };
  }

  // Personal Details methods
  async updatePersonalDetails(customUserId, personalDetails) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    this.userData.users[customUserId].personalDetails = {
      ...this.userData.users[customUserId].personalDetails,
      ...personalDetails,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].personalDetails;
  }

  // Social Links methods
  async updateSocialLinks(customUserId, socialLinks) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    this.userData.users[customUserId].socialLinks = {
      ...this.userData.users[customUserId].socialLinks,
      ...socialLinks,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].socialLinks;
  }

  // Update user auth info (Firestore fields)
  async updateUserAuthInfo(customUserId, authData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    this.userData.users[customUserId].profile = {
      ...this.userData.users[customUserId].profile,
      ...authData,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserData();
    return this.userData.users[customUserId].profile;
  }

  // Add project to user
  async addUserProject(customUserId, projectData) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const project = {
      projectId: projectData.projectId,
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      tags: projectData.tags || [],
      imageUrl: projectData.imageUrl,
      projectLink: projectData.projectLink,
      githubLink: projectData.githubLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      downloads: 0
    };

    this.userData.users[customUserId].projects.created.push(project);
    this.userData.users[customUserId].projects.count += 1;
    this.userData.users[customUserId].stats.projectsCount += 1;

    // Add activity for project creation
    await this.addActivity(customUserId, {
      type: 'project_created',
      description: `Created new project: ${project.title}`,
      metadata: { projectId: project.projectId, projectTitle: project.title }
    });

    await this.saveUserData();
    return project;
  }

  // Remove project ID from user's created projects
  async removeUserProject(customUserId, projectId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const projectIdNum = parseInt(projectId);
    const projectIndex = this.userData.users[customUserId].projects.created.indexOf(projectIdNum);
    
    if (projectIndex !== -1) {
      // Remove project ID from created array
      this.userData.users[customUserId].projects.created.splice(projectIndex, 1);
      
      // Decrement counts
      this.userData.users[customUserId].projects.count = Math.max(0, this.userData.users[customUserId].projects.count - 1);
      this.userData.users[customUserId].stats.projectsCount = Math.max(0, this.userData.users[customUserId].stats.projectsCount - 1);
      
      await this.saveUserData();
      console.log(`Project ID ${projectId} removed from user ${customUserId}`);
      return true;
    } else {
      console.log(`Project ID ${projectId} not found in user ${customUserId}'s created projects`);
      return false;
    }
  }

  // Add a skill (flat array)
  async addUserSkill(customUserId, skillData) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const { name } = skillData;
    if (!name) {
      throw new Error('Skill name is required');
    }

    // Check if skill already exists
    if (this.userData.users[customUserId].skills.includes(name)) {
      throw new Error('Skill already exists');
    }

    this.userData.users[customUserId].skills.push(name);
    await this.saveUserData();

    // Add activity for skill addition
    await this.addActivity(customUserId, {
      type: 'skill_added',
      description: `Added new skill: ${name}`,
      metadata: { skillName: name }
    });

    return this.userData.users[customUserId].skills;
  }

  // Remove skill from user (flat array)
  async removeUserSkill(customUserId, skillName) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }
    // Ensure skills is an array
    if (!Array.isArray(this.userData.users[customUserId].skills)) {
      this.userData.users[customUserId].skills = [];
    }
    // Remove the skill if present
    const skillIndex = this.userData.users[customUserId].skills.indexOf(skillName);
    if (skillIndex > -1) {
      this.userData.users[customUserId].skills.splice(skillIndex, 1);
      await this.saveUserData();
    }
    return this.userData.users[customUserId].skills;
  }

  // Add to cart
  async addToCart(customUserId, productData) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const cartItem = {
      productId: productData.productId,
      addedAt: new Date().toISOString(),
      quantity: productData.quantity || 1
    };

    // Check if item already exists in cart
    const existingIndex = this.userData.users[customUserId].marketplace.cart.findIndex(
      item => item.productId === productData.productId
    );

    if (existingIndex >= 0) {
      this.userData.users[customUserId].marketplace.cart[existingIndex].quantity += cartItem.quantity;
    } else {
      this.userData.users[customUserId].marketplace.cart.push(cartItem);
    }

    await this.saveUserData();
    return this.userData.users[customUserId].marketplace.cart;
  }

  // Remove from cart
  async removeFromCart(customUserId, productId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const cart = this.userData.users[customUserId].marketplace.cart;
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    cart.splice(itemIndex, 1);
    await this.saveUserData();
    
    return cart;
  }

  // Clear cart
  async clearCart(customUserId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    this.userData.users[customUserId].marketplace.cart = [];
    await this.saveUserData();
  }

  // Add activity
  async addActivity(customUserId, activityData) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const activity = {
      id: Date.now().toString(),
      type: activityData.type,
      description: activityData.description,
      timestamp: new Date().toISOString(),
      metadata: activityData.metadata || {}
    };

    this.userData.users[customUserId].activities.recent.unshift(activity);
    
    // Keep only last 50 activities
    if (this.userData.users[customUserId].activities.recent.length > 50) {
      this.userData.users[customUserId].activities.recent = 
        this.userData.users[customUserId].activities.recent.slice(0, 50);
    }

    await this.saveUserData();
    return activity;
  }

  // Follow user
  async followUser(followerId, followingId) {
    await this.loadUserData();
    
    if (!this.userData.users[followerId] || !this.userData.users[followingId]) {
      throw new Error('User not found');
    }

    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Add to following list if not already following
    if (!this.userData.users[followerId].social.following.includes(followingId)) {
      this.userData.users[followerId].social.following.push(followingId);
      this.userData.users[followerId].social.followingCount += 1;
    }

    // Add to followers list if not already a follower
    if (!this.userData.users[followingId].social.followers.includes(followerId)) {
      this.userData.users[followingId].social.followers.push(followerId);
      this.userData.users[followingId].social.followersCount += 1;
    }

    await this.saveUserData();

    // Add activity for following
    const followerName = this.userData.users[followerId].profile.firstName || 'User';
    const followingName = this.userData.users[followingId].profile.firstName || 'User';
    
    await this.addActivity(followerId, {
      type: 'user_followed',
      description: `Started following ${followingName}`,
      metadata: { followingId, followingName }
    });

    await this.addActivity(followingId, {
      type: 'user_followed',
      description: `${followerName} started following you`,
      metadata: { followerId, followerName }
    });

    return {
      followersCount: this.userData.users[followingId].social.followersCount,
      followingCount: this.userData.users[followerId].social.followingCount
    };
  }

  // Get user statistics
  async getUserStats(customUserId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    const user = this.userData.users[customUserId];
    
    return {
      projectsCount: user.stats.projectsCount,
      followersCount: user.social.followersCount,
      followingCount: user.social.followingCount,
      totalLikes: user.stats.totalLikes,
      totalViews: user.stats.totalViews,
      totalDownloads: user.stats.totalDownloads,
      memberSince: user.stats.memberSince,
      points: user.activities.points
    };
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    await this.loadUserData();
    return Object.keys(this.userData.users).map(customUserId => ({
      customUserId,
      profile: this.userData.users[customUserId].profile,
      stats: this.userData.users[customUserId].stats
    }));
  }

  // Delete user
  async deleteUser(customUserId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    delete this.userData.users[customUserId];
    await this.saveUserData();
    
    return { success: true, message: 'User deleted successfully' };
  }

  // Track project view
  async trackProjectView(customUserId, projectId) {
    await this.loadUserData();
    
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }

    // Find the project in user's created projects
    const user = this.userData.users[customUserId];
    const project = user.projects.created.find(p => p.projectId === projectId);
    
    if (project) {
      project.views = (project.views || 0) + 1;
      user.stats.totalViews = (user.stats.totalViews || 0) + 1;
      
      await this.saveUserData();
      
      // Add activity for project view milestone
      if (project.views === 10 || project.views === 50 || project.views === 100) {
        await this.addActivity(customUserId, {
          type: 'project_milestone',
          description: `Your project "${project.title}" reached ${project.views} views!`,
          metadata: { projectId, projectTitle: project.title, views: project.views }
        });
      }
    }

    return { views: project?.views || 0 };
  }
}

module.exports = new UserService(); 