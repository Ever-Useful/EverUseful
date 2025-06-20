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
      customUserId,
      profile: {
        avatar: userData.avatar ?? null,
        bio: userData.bio ?? null,
        location: userData.location ?? null,
        website: userData.website ?? null,
        title: userData.title ?? null,
        createdAt: new Date().toISOString(),
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

    // Handle student-specific fields
    if (profileData.userType === 'student') {
      // Store student-specific data in a separate section
      if (!this.userData.users[customUserId].studentData) {
        this.userData.users[customUserId].studentData = {};
      }
      
      this.userData.users[customUserId].studentData = {
        ...this.userData.users[customUserId].studentData,
        college: profileData.college || null,
        degree: profileData.degree || null,
        course: profileData.course || null,
        year: profileData.year || null,
        updatedAt: new Date().toISOString()
      };
    }

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

    await this.saveUserData();
    return project;
  }

  
// Add skill to user (flat array)
  async addUserSkill(customUserId, skillData) {
    await this.loadUserData();
    if (!this.userData.users[customUserId]) {
      throw new Error('User not found');
    }
    // Ensure skills is an array
    if (!Array.isArray(this.userData.users[customUserId].skills)) {
      this.userData.users[customUserId].skills = [];
    }
    // Add the skill string if not already present
    if (!this.userData.users[customUserId].skills.includes(skillData.name)) {
      this.userData.users[customUserId].skills.push(skillData.name);
      await this.saveUserData();
    }
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

    // Add to following list
    if (!this.userData.users[followerId].social.following.includes(followingId)) {
      this.userData.users[followerId].social.following.push(followingId);
      this.userData.users[followerId].social.followingCount += 1;
    }

    // Add to followers list
    if (!this.userData.users[followingId].social.followers.includes(followerId)) {
      this.userData.users[followingId].social.followers.push(followerId);
      this.userData.users[followingId].social.followersCount += 1;
    }

    await this.saveUserData();
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
}

module.exports = new UserService(); 