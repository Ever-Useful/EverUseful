const dynamoDBService = require('./dynamoDBService');
const s3Service = require('./s3Service');

class UserService {
  constructor() {
    // Use DynamoDB service instead of JSON files
    this.dbService = dynamoDBService;
    this.s3Service = s3Service;
  }

  // Generate custom user ID
  async generateCustomUserId() {
    return await this.dbService.generateCustomUserId();
  }

  // Create new user
  async createUser(firebaseUid, userData) {
    const user = await this.dbService.createUser(firebaseUid, userData);
    
    // Create S3 folder structure for the new user
    try {
      await this.s3Service.createUserFolder(user.customUserId);
      console.log(`Created S3 folder structure for user: ${user.customUserId}`);
    } catch (error) {
      console.error(`Failed to create S3 folder for user ${user.customUserId}:`, error);
      // Don't fail user creation if S3 folder creation fails
    }
    
    return user;
  }

  // Find user by Firebase UID
  async findUserByFirebaseUid(firebaseUid) {
    return await this.dbService.findUserByFirebaseUid(firebaseUid);
  }

  // Alias for findUserByFirebaseUid (for dashboard compatibility)
  async getUserByFirebaseUid(firebaseUid) {
    return await this.dbService.findUserByFirebaseUid(firebaseUid);
  }

  // Find user by custom user ID
  async findUserByCustomId(customUserId) {
    return await this.dbService.findUserByCustomId(customUserId);
  }

  // Update user profile
  async updateUserProfile(customUserId, profileData) {
    return await this.dbService.updateUserProfile(customUserId, profileData);
  }

  // Update student data
  async updateStudentData(customUserId, studentData) {
    return await this.dbService.updateStudentData(customUserId, studentData);
  }

  // Update professor data
  async updateProfessorData(customUserId, professorData) {
    return await this.dbService.updateProfessorData(customUserId, professorData);
  }

  // Update freelancer data
  async updateFreelancerData(customUserId, freelancerData) {
    return await this.dbService.updateFreelancerData(customUserId, freelancerData);
  }

  // Education methods
  async addEducation(customUserId, educationData) {
    return await this.dbService.addEducation(customUserId, educationData);
  }

  async updateEducation(customUserId, educationId, educationData) {
    return await this.dbService.updateEducation(customUserId, educationId, educationData);
  }

  async deleteEducation(customUserId, educationId) {
    return await this.dbService.deleteEducation(customUserId, educationId);
  }

  // Work Experience methods
  async addWorkExperience(customUserId, workData) {
    return await this.dbService.addWorkExperience(customUserId, workData);
  }

  async updateWorkExperience(customUserId, workId, workData) {
    return await this.dbService.updateWorkExperience(customUserId, workId, workData);
  }

  async deleteWorkExperience(customUserId, workId) {
    return await this.dbService.deleteWorkExperience(customUserId, workId);
  }

  // Personal Details methods
  async updatePersonalDetails(customUserId, personalDetails) {
    return await this.dbService.updatePersonalDetails(customUserId, personalDetails);
  }

  // Social Links methods
  async updateSocialLinks(customUserId, socialLinks) {
    return await this.dbService.updateSocialLinks(customUserId, socialLinks);
  }

  // Update user auth info (Firestore fields)
  async updateUserAuthInfo(customUserId, authData) {
    return await this.dbService.updateUserProfile(customUserId, authData);
  }

  // Add user project
  async addUserProject(customUserId, projectData) {
    return await this.dbService.addUserProject(customUserId, projectData);
  }

  // Remove user project
  async removeUserProject(customUserId, projectId) {
    return await this.dbService.removeUserProject(customUserId, projectId);
  }

  // Add user skill
  async addUserSkill(customUserId, skillData) {
    return await this.dbService.addUserSkill(customUserId, skillData);
  }

  // Remove user skill
  async removeUserSkill(customUserId, skillName) {
    return await this.dbService.removeUserSkill(customUserId, skillName);
  }

  // Add to cart
  async addToCart(customUserId, productData) {
    return await this.dbService.addToCart(customUserId, productData);
  }

  // Get user cart
  async getUserCart(customUserId) {
    return await this.dbService.getUserCart(customUserId);
  }

  // Remove from cart
  async removeFromCart(customUserId, productId) {
    return await this.dbService.removeFromCart(customUserId, productId);
  }

  // Clear cart
  async clearCart(customUserId) {
    return await this.dbService.clearCart(customUserId);
  }

  // Add activity
  async addActivity(customUserId, activityData) {
    return await this.dbService.addActivity(customUserId, activityData);
  }

  // Follow user
  async followUser(followerId, followingId) {
    return await this.dbService.followUser(followerId, followingId);
  }

  // Get user connections (following list with profile data)
  async getUserConnections(customUserId) {
    return await this.dbService.getUserConnections(customUserId);
  }

  // Get user statistics
  async getUserStats(customUserId) {
    return await this.dbService.getUserStats(customUserId);
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    return await this.dbService.getAllUsers();
  }

  // Delete user
  async deleteUser(customUserId) {
    return await this.dbService.deleteUser(customUserId);
  }

  // Track project view
  async trackProjectView(customUserId, projectId) {
    return await this.dbService.trackProjectView(customUserId, projectId);
  }

  // userService.js
  async searchUsers(query) {
    return await this.dbService.searchUsersByName(query);
}

// Send connection request
async sendConnectionRequest(senderId, receiverId) {
  return await this.dbService.createConnectionRequest(senderId, receiverId);
}

// Accept connection request
async acceptConnectionRequest(receiverId, senderId) {
  return await this.dbService.acceptConnectionRequest(receiverId, senderId);
}

// Reject connection request
async rejectConnectionRequest(receiverId, senderId) {
  return await this.dbService.rejectConnectionRequest(receiverId, senderId);
}

// Withdraw (cancel) connection request
async withdrawConnectionRequest(senderId, receiverId) {
  return await this.dbService.withdrawConnectionRequest(senderId, receiverId);
}

async getConnections(userId) {
  const user = await this.findUserByCustomId(userId);
  if (!user) return { sent: [], received: [], connected: [] };

  // Existing normalized structure
  const connections = user.connections || { sent: [], received: [], connected: [] };

  // Legacy social connections (array of objects)
  const social = user.profile?.social?.connections || [];

  // Merge legacy into normalized
  social.forEach(c => {
    if (c.status === "incoming" && !connections.received.includes(c.userId)) {
      connections.received.push(c.userId);
    }
    if (c.status === "sent" && !connections.sent.includes(c.targetUserId)) {
      connections.sent.push(c.targetUserId);
    }
    if (c.status === "connected" && !connections.connected.includes(c.targetUserId)) {
      connections.connected.push(c.targetUserId);
    }
  });

  console.log(" Final merged connections:", connections);
  return connections;
}

// Get logged-in user's ID and connections
async getUserConnectionsWithId(customUserId) {
  return await this.dbService.getUserConnectionsWithId(customUserId);
}

  // ✅ New: get only received connections with profile data
  async getReceivedConnectionsWithProfiles(customUserId) {
    return await this.dbService.getReceivedConnectionsWithProfiles(customUserId);
  }



}

module.exports = new UserService(); 