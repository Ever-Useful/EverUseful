const { dynamodb, TABLES } = require('../config/aws');

class DynamoDBService {
  constructor() {
    this.usersTable = TABLES.USERS;
    this.marketplaceTable = TABLES.MARKETPLACE;
  }

  // User Operations
  async generateCustomUserId() {
    try {
      // Get the highest user ID from DynamoDB
      const params = {
        TableName: this.usersTable,
        ProjectionExpression: 'customUserId',
        FilterExpression: 'begins_with(customUserId, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': 'USER_'
        }
      };

      const result = await dynamodb.scan(params).promise();
      let maxId = 0;

      result.Items.forEach(item => {
        const match = item.customUserId.match(/^USER_(\d{6})$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxId) maxId = num;
        }
      });

      // Generate next ID
      const nextId = maxId + 1;
      return `USER_${nextId.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating custom user ID:', error);
      // Fallback: use timestamp-based ID
      return `USER_${Date.now().toString().slice(-6)}`;
    }
  }

  async createUser(firebaseUid, userData) {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByFirebaseUid(firebaseUid);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Generate custom user ID
      const customUserId = await this.generateCustomUserId();

      const newUser = {
        firebaseUid,
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
          phoneNumber: userData.phoneNumber ?? userData.mobile ?? '',
          gender: userData.gender ?? '',
          domain: userData.domain ?? '',
          purpose: userData.purpose ?? '',
          role: userData.role ?? '',
          dateOfBirth: userData.dateOfBirth ?? '',
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
          connected: [],
          followersCount: 0,
          followingCount: 0
        },
        connections: {
        sent: [],      // requests this user sent
        received: [],  // requests this user got
        pending: []    // optional, you can use or skip
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

      const params = {
        TableName: this.usersTable,
        Item: newUser
      };

      await dynamodb.put(params).promise();

      return {
        customUserId,
        profile: newUser.profile
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findUserByFirebaseUid(firebaseUid) {
    try {
      const params = {
        TableName: this.usersTable,
        IndexName: 'FirebaseUidIndex',
        KeyConditionExpression: 'firebaseUid = :firebaseUid',
        ExpressionAttributeValues: {
          ':firebaseUid': firebaseUid
        }
      };

      const result = await dynamodb.query(params).promise();
      const user = result.Items.length > 0 ? result.Items[0] : null;
      
      if (user) {
        return this.reconstructUserData(user);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by Firebase UID:', error);
      // Fallback to scan if index doesn't exist
      try {
        const scanParams = {
          TableName: this.usersTable,
          FilterExpression: 'firebaseUid = :firebaseUid',
          ExpressionAttributeValues: {
            ':firebaseUid': firebaseUid
          }
        };
        const scanResult = await dynamodb.scan(scanParams).promise();
        const user = scanResult.Items.length > 0 ? scanResult.Items[0] : null;
        
        if (user) {
          return this.reconstructUserData(user);
        }
        return null;
      } catch (scanError) {
        console.error('Error in fallback scan:', scanError);
        return null;
      }
    }
  }

  async findUserByCustomId(customUserId) {
    try {
      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        }
      };

      const result = await dynamodb.get(params).promise();
      const user = result.Item || null;
      
      if (user) {
        return this.reconstructUserData(user);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by custom ID:', error);
      return null;
    }
  }

  async findUserByPhone(phoneNumber) {
    try {
      const params = {
        TableName: this.usersTable,
        FilterExpression: 'phoneNumber = :phone OR mobile = :phone',
        ExpressionAttributeValues: {
          ':phone': phoneNumber
        }
      };

      const result = await dynamodb.scan(params).promise();
      const user = result.Items[0] || null;
      
      if (user) {
        return this.reconstructUserData(user);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by phone:', error);
      return null;
    }
  }

  // Reconstruct user data from flattened DynamoDB structure
  reconstructUserData(user) {
    const reconstructed = {
      customUserId: user.customUserId,
      firebaseUid: user.firebaseUid,
      profile: {},
      stats: user.stats || {},
      studentData: user.studentData || null,
      professorData: user.professorData || null,
      freelancerData: user.freelancerData || null,
      education: user.education || [],
      workExperience: user.workExperience || [],
      skills: user.skills || [],
      personalDetails: user.personalDetails || {},
      socialLinks: user.socialLinks || {},
      projects: user.projects || { created: [], collaborated: [], favorites: [], count: 0 },
      activities: user.activities || {},
      preferences: user.preferences || {},
      marketplace: user.marketplace || {},
      social: user.social || {},
      connections: user.connections || { sent: [], received: [], pending: [] }
    };
        // ✅ Add connections back from DB
     

    // Reconstruct profile from flattened keys
    Object.keys(user).forEach(key => {
      if (key.startsWith('profile.')) {
        const profileKey = key.replace('profile.', '');
        reconstructed.profile[profileKey] = user[key];
      }
    });

    // Reconstruct studentData from flattened keys
    if (!reconstructed.studentData) {
      reconstructed.studentData = {};
      Object.keys(user).forEach(key => {
        if (key.startsWith('studentData.')) {
          const studentKey = key.replace('studentData.', '');
          reconstructed.studentData[studentKey] = user[key];
        }
      });
    }

    // Reconstruct professorData from flattened keys
    if (!reconstructed.professorData) {
      reconstructed.professorData = {};
      Object.keys(user).forEach(key => {
        if (key.startsWith('professorData.')) {
          const professorKey = key.replace('professorData.', '');
          reconstructed.professorData[professorKey] = user[key];
        }
      });
    }

    // Reconstruct freelancerData from flattened keys or use existing nested object
    if (!reconstructed.freelancerData || Object.keys(reconstructed.freelancerData).length === 0) {
      reconstructed.freelancerData = {};
      Object.keys(user).forEach(key => {
        if (key.startsWith('freelancerData.')) {
          const freelancerKey = key.replace('freelancerData.', '');
          reconstructed.freelancerData[freelancerKey] = user[key];
        }
      });
    }

    // Reconstruct personalDetails from flattened keys
    if (!reconstructed.personalDetails) {
      reconstructed.personalDetails = {};
      Object.keys(user).forEach(key => {
        if (key.startsWith('personalDetails.')) {
          const personalKey = key.replace('personalDetails.', '');
          reconstructed.personalDetails[personalKey] = user[key];
        }
      });
    }

    return reconstructed;
  }

  async updateUser(customUserId, updateData) {
    try {
      // Build update expression dynamically
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(updateData).forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = updateData[key];
      });

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateUserProfile(customUserId, profileData) {
    try {
      const updateData = {
        'profile.updatedAt': new Date().toISOString()
      };

      // Add profile fields to update
      Object.keys(profileData).forEach(key => {
        updateData[`profile.${key}`] = profileData[key];
      });

      return await this.updateUser(customUserId, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updateStudentData(customUserId, studentData) {
    try {
      const updateData = {
        'studentData.updatedAt': new Date().toISOString()
      };

      Object.keys(studentData).forEach(key => {
        updateData[`studentData.${key}`] = studentData[key];
      });

      return await this.updateUser(customUserId, updateData);
    } catch (error) {
      console.error('Error updating student data:', error);
      throw error;
    }
  }

  async updateProfessorData(customUserId, professorData) {
    try {
      const updateData = {
        'professorData.updatedAt': new Date().toISOString()
      };

      Object.keys(professorData).forEach(key => {
        updateData[`professorData.${key}`] = professorData[key];
      });

      return await this.updateUser(customUserId, updateData);
    } catch (error) {
      console.error('Error updating professor data:', error);
      throw error;
    }
  }

  async updateFreelancerData(customUserId, freelancerData) {
    try {
      // Prepare the complete freelancerData object
      const completeFreelancerData = {
        experience: freelancerData.experience || '',
        portfolio: freelancerData.portfolio || '',
        location: freelancerData.location || '',
        skills: freelancerData.skills || [],
        hourlyRate: freelancerData.hourlyRate || '',
        avgResponseTime: freelancerData.avgResponseTime || '',
        updatedAt: new Date().toISOString()
      };
      
      // Save the entire freelancerData object as a nested object
      const updateData = {
        'freelancerData': completeFreelancerData
      };

      const result = await this.updateUser(customUserId, updateData);
      return result;
    } catch (error) {
      console.error('Error updating freelancer data:', error);
      throw error;
    }
  }

  async addEducation(customUserId, educationData) {
    try {
      const education = {
        id: `edu_${Date.now()}`,
        ...educationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET education = list_append(if_not_exists(education, :empty_list), :education_item)',
        ExpressionAttributeValues: {
          ':education_item': [education],
          ':empty_list': []
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return education;
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  }

  async updateEducation(customUserId, educationId, educationData) {
    try {
      // First get the current user to find the education index
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const educationIndex = user.education.findIndex(edu => edu.id === educationId);
      if (educationIndex === -1) {
        throw new Error('Education record not found');
      }

      // Update the specific education item
      const updatedEducation = {
        ...user.education[educationIndex],
        ...educationData,
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: `SET education[${educationIndex}] = :education`,
        ExpressionAttributeValues: {
          ':education': updatedEducation
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return updatedEducation;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  }

  async deleteEducation(customUserId, educationId) {
    try {
      // First get the current user to find the education index
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const educationIndex = user.education.findIndex(edu => edu.id === educationId);
      if (educationIndex === -1) {
        throw new Error('Education record not found');
      }

      // Remove the education item
      const updatedEducation = user.education.filter((_, index) => index !== educationIndex);

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET education = :education',
        ExpressionAttributeValues: {
          ':education': updatedEducation
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return { success: true };
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }

  async addWorkExperience(customUserId, workData) {
    try {
      const workExperience = {
        id: `work_${Date.now()}`,
        ...workData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET workExperience = list_append(if_not_exists(workExperience, :empty_list), :work_item)',
        ExpressionAttributeValues: {
          ':work_item': [workExperience],
          ':empty_list': []
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return workExperience;
    } catch (error) {
      console.error('Error adding work experience:', error);
      throw error;
    }
  }

  async updateWorkExperience(customUserId, workId, workData) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const workIndex = user.workExperience.findIndex(work => work.id === workId);
      if (workIndex === -1) {
        throw new Error('Work experience record not found');
      }

      const updatedWork = {
        ...user.workExperience[workIndex],
        ...workData,
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: `SET workExperience[${workIndex}] = :work`,
        ExpressionAttributeValues: {
          ':work': updatedWork
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return updatedWork;
    } catch (error) {
      console.error('Error updating work experience:', error);
      throw error;
    }
  }

  async deleteWorkExperience(customUserId, workId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const workIndex = user.workExperience.findIndex(work => work.id === workId);
      if (workIndex === -1) {
        throw new Error('Work experience record not found');
      }

      const updatedWorkExperience = user.workExperience.filter((_, index) => index !== workIndex);

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET workExperience = :workExperience',
        ExpressionAttributeValues: {
          ':workExperience': updatedWorkExperience
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return { success: true };
    } catch (error) {
      console.error('Error deleting work experience:', error);
      throw error;
    }
  }

  async updatePersonalDetails(customUserId, personalDetails) {
    try {
      const updateData = {
        'personalDetails.updatedAt': new Date().toISOString()
      };

      Object.keys(personalDetails).forEach(key => {
        updateData[`personalDetails.${key}`] = personalDetails[key];
      });

      return await this.updateUser(customUserId, updateData);
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw error;
    }
  }

  async updateSocialLinks(customUserId, socialLinks) {
    try {
      const updateData = {
        'socialLinks.updatedAt': new Date().toISOString()
      };

      Object.keys(socialLinks).forEach(key => {
        updateData[`socialLinks.${key}`] = socialLinks[key];
      });

      return await this.updateUser(customUserId, updateData);
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  }

    async addUserProject(customUserId, projectData) {
    try {
      // First, get the current user to check if projects object exists
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Ensure projects object exists
      if (!user.projects) {
        user.projects = {
          created: [],
          collaborated: [],
          favorites: [],
          count: 0
        };
      }
  
      // Create project object with the correct structure
      const project = {
        projectId: projectData.id || Date.now().toString(),
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        tags: Array.isArray(projectData.tags) ? projectData.tags : (projectData.tags ? projectData.tags.split(',').map(tag => tag.trim()) : []),
        imageUrl: projectData.image || projectData.imageUrl || '',
        projectLink: projectData.projectLink || '',
        githubLink: projectData.githubLink || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        views: 0,
        downloads: 0
      };
  
      // Store only the project ID in the user's projects.created array
      const projectId = project.projectId;
  
      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET projects.created = list_append(if_not_exists(projects.created, :empty_list), :project_id), projects.#count = if_not_exists(projects.#count, :zero) + :inc, stats.projectsCount = if_not_exists(stats.projectsCount, :zero) + :inc',
        ExpressionAttributeNames: {
          '#count': 'count'
        },
        ExpressionAttributeValues: {
          ':project_id': [projectId],
          ':empty_list': [],
          ':inc': 1,
          ':zero': 0
        },
        ReturnValues: 'ALL_NEW'
      };
  
      const result = await dynamodb.update(params).promise();
      return project;
    } catch (error) {
      console.error('Error adding user project:', error);
      throw error;
    }
  }

  async removeUserProject(customUserId, projectId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if projects.created exists and is an array
      if (!user.projects || !user.projects.created || !Array.isArray(user.projects.created)) {
        return { success: true, message: 'No projects to remove' };
      }

      // Find the project ID in the array (projects.created contains strings, not objects)
      const projectIndex = user.projects.created.findIndex(p => p === projectId);
      if (projectIndex === -1) {
        return { success: true, message: 'Project not found in user projects' };
      }

      // Remove the project ID from the array
      const updatedProjects = user.projects.created.filter((_, index) => index !== projectIndex);

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET projects.created = :projects, projects.count = :count, stats.projectsCount = :count',
        ExpressionAttributeValues: {
          ':projects': updatedProjects,
          ':count': updatedProjects.length
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return { success: true, message: 'Project removed successfully' };
    } catch (error) {
      console.error('Error removing user project:', error);
      throw error;
    }
  }

  async addUserSkill(customUserId, skillData) {
    try {
      const skill = {
        name: skillData.name,
        category: skillData.category || 'General',
        expertise: skillData.expertise || 'Beginner',
        addedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET skills = list_append(if_not_exists(skills, :empty_list), :skill_item)',
        ExpressionAttributeValues: {
          ':skill_item': [skill],
          ':empty_list': []
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return skill;
    } catch (error) {
      console.error('Error adding user skill:', error);
      throw error;
    }
  }

  async removeUserSkill(customUserId, skillName) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedSkills = user.skills.filter(skill => 
        skill.name.toLowerCase() !== skillName.toLowerCase()
      );

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET skills = :skills',
        ExpressionAttributeValues: {
          ':skills': updatedSkills
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return updatedSkills;
    } catch (error) {
      console.error('Error removing user skill:', error);
      throw error;
    }
  }

  async addToCart(customUserId, productData) {
    try {
      const cartItem = {
        productId: productData.productId,
        addedAt: new Date().toISOString(),
        quantity: productData.quantity || 1
      };

      // Get current cart to check for existing items
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentCart = user.marketplace.cart || [];
      const existingIndex = currentCart.findIndex(item => item.productId === productData.productId);

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = [...currentCart];
        updatedCart[existingIndex].quantity += cartItem.quantity;
      } else {
        updatedCart = [...currentCart, cartItem];
      }

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET marketplace.cart = :cart',
        ExpressionAttributeValues: {
          ':cart': updatedCart
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async getUserCart(customUserId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      return user.marketplace.cart || [];
    } catch (error) {
      console.error('Error getting user cart:', error);
      throw error;
    }
  }

  async removeFromCart(customUserId, productId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentCart = user.marketplace.cart || [];
      const updatedCart = currentCart.filter(item => item.productId !== productId);

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET marketplace.cart = :cart',
        ExpressionAttributeValues: {
          ':cart': updatedCart
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(customUserId) {
    try {
      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET marketplace.cart = :empty_cart',
        ExpressionAttributeValues: {
          ':empty_cart': []
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async addActivity(customUserId, activityData) {
    try {
      const activity = {
        id: Date.now().toString(),
        type: activityData.type,
        description: activityData.description,
        timestamp: new Date().toISOString(),
        metadata: activityData.metadata || {}
      };

      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentActivities = user.activities.recent || [];
      const updatedActivities = [activity, ...currentActivities].slice(0, 5); // Keep only last 5

      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        },
        UpdateExpression: 'SET activities.recent = :activities',
        ExpressionAttributeValues: {
          ':activities': updatedActivities
        },
        ReturnValues: 'ALL_NEW'
      };

      await dynamodb.update(params).promise();
      return activity;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }

  async followUser(followerId, followingId) {
    try {
      const follower = await this.findUserByCustomId(followerId);
      const following = await this.findUserByCustomId(followingId);

      if (!follower || !following) {
        throw new Error('User not found');
      }

      if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
      }

      // Update follower's following list
      const followerFollowing = follower.social.following || [];
      if (!followerFollowing.includes(followingId)) {
        const updatedFollowerFollowing = [...followerFollowing, followingId];
        
        await this.updateUser(followerId, {
          'social.following': updatedFollowerFollowing,
          'social.followingCount': updatedFollowerFollowing.length
        });
      }

      // Update following's followers list
      const followingFollowers = following.social.followers || [];
      if (!followingFollowers.includes(followerId)) {
        const updatedFollowingFollowers = [...followingFollowers, followerId];
        
        await this.updateUser(followingId, {
          'social.followers': updatedFollowingFollowers,
          'social.followersCount': updatedFollowingFollowers.length
        });
      }

      return {
        followersCount: (following.social.followers || []).length + 1,
        followingCount: (follower.social.following || []).length + 1
      };
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async getUserStats(customUserId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        projectsCount: user.stats.projectsCount || 0,
        followersCount: user.social.followersCount || 0,
        followingCount: user.social.followingCount || 0,
        totalLikes: user.stats.totalLikes || 0,
        totalViews: user.stats.totalViews || 0,
        totalDownloads: user.stats.totalDownloads || 0,
        memberSince: user.stats.memberSince,
        points: user.activities.points || 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const params = {
        TableName: this.usersTable
      };

      const result = await dynamodb.scan(params).promise();
      return result.Items.map(user => this.reconstructUserData(user));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async deleteUser(customUserId) {
    try {
      const params = {
        TableName: this.usersTable,
        Key: {
          customUserId: customUserId
        }
      };

      await dynamodb.delete(params).promise();
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async trackProjectView(customUserId, projectId) {
    try {
      const user = await this.findUserByCustomId(customUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const project = user.projects.created.find(p => p.projectId === projectId);
      if (project) {
        const updatedViews = (project.views || 0) + 1;
        const updatedTotalViews = (user.stats.totalViews || 0) + 1;

        const params = {
          TableName: this.usersTable,
          Key: {
            customUserId: customUserId
          },
          UpdateExpression: 'SET stats.totalViews = :totalViews',
          ExpressionAttributeValues: {
            ':totalViews': updatedTotalViews
          },
          ReturnValues: 'ALL_NEW'
        };

        await dynamodb.update(params).promise();

        // Update project views (this is more complex as we need to find the project index)
        const projectIndex = user.projects.created.findIndex(p => p.projectId === projectId);
        if (projectIndex !== -1) {
          const updatedProject = { ...project, views: updatedViews };
          
          const projectParams = {
            TableName: this.usersTable,
            Key: {
              customUserId: customUserId
            },
            UpdateExpression: `SET projects.created[${projectIndex}] = :project`,
            ExpressionAttributeValues: {
              ':project': updatedProject
            }
          };

          await dynamodb.update(projectParams).promise();
        }

        return { views: updatedViews };
      }

      return { views: 0 };
    } catch (error) {
      console.error('Error tracking project view:', error);
      throw error;
    }
  }

    // Marketplace Operations
  async getAllMarketplaceItems() {
    try {
      const params = {
        TableName: this.marketplaceTable
      };
      
      const result = await dynamodb.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      console.error('Error getting marketplace items:', error);
      throw error;
    }
  }

  async getMarketplaceData() {
    try {
      const params = {
        TableName: this.marketplaceTable
      };
      
      const result = await dynamodb.scan(params).promise();
      const items = result.Items || [];
      

      
      // Since most items don't have a type field, treat all items as projects for now
      // In the future, we can add proper type classification
      return {
        projects: items, // Return all items as projects since they're all marketplace items
        products: items.filter(item => item.type === 'product'),
        services: items.filter(item => item.type === 'service')
      };
    } catch (error) {
      console.error('Error getting marketplace data:', error);
      throw error;
    }
  }

  async getMarketplaceItem(itemId) {
    try {
      const params = {
        TableName: this.marketplaceTable,
        Key: {
          id: itemId
        }
      };

      const result = await dynamodb.get(params).promise();
      return result.Item || null;
    } catch (error) {
      console.error('Error getting marketplace item:', error);
      throw error;
    }
  }

  async createMarketplaceItem(itemData) {
    try {
      const item = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: this.marketplaceTable,
        Item: item
      };

      await dynamodb.put(params).promise();
      return item;
    } catch (error) {
      console.error('Error creating marketplace item:', error);
      throw error;
    }
  }

  async updateMarketplaceItem(itemId, updateData) {
    try {
      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(updateData).forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = updateData[key];
      });

      // Add updatedAt
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: this.marketplaceTable,
        Key: {
          id: itemId
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error updating marketplace item:', error);
      throw error;
    }
  }

  async deleteMarketplaceItem(itemId) {
    try {
      const params = {
        TableName: this.marketplaceTable,
        Key: {
          id: itemId
        }
      };

      await dynamodb.delete(params).promise();
      return { success: true, message: 'Marketplace item deleted successfully' };
    } catch (error) {
      console.error('Error deleting marketplace item:', error);
      throw error;
    }
  }

  // dynamoDBService.js
async searchUsersByName(query) {
  try {
    const params = {
      TableName: this.usersTable
    };

    const result = await dynamodb.scan(params).promise();
    const lowerQ = (query || '').toLowerCase();

    return (result.Items || [])
      .map(user => {
  const authMap = user.auth || {};
  const profileMap = user.profile || {};

  const firstName =
    authMap.firstName ||
    profileMap.firstName ||
    user['profile.firstName'] ||
    user.firstName ||
    '';
  const lastName =
    authMap.lastName ||
    profileMap.lastName ||
    user['profile.lastName'] ||
    user.lastName ||
    '';
  const avatar =
    profileMap.avatar ||
    user['profile.avatar'] ||
    user.avatar ||
    null;
  
  const userType =
    authMap.userType ||  //  always prioritize auth
    (profileMap.userType && profileMap.userType !== 'student' ? profileMap.userType : '') ||
    user['profile.userType'] ||
    user.userType ||
    '';

  const username =
    authMap.username ||
    profileMap.username ||
    user['profile.username'] ||
    user.username ||
    '';

  return {
    customUserId: user.customUserId,
    profile: { firstName, lastName, avatar, userType, username }
  };
})

      .filter(u =>
        (u.profile.firstName || '').toLowerCase().includes(lowerQ) ||
        (u.profile.lastName || '').toLowerCase().includes(lowerQ) ||
        (u.profile.username || '').toLowerCase().includes(lowerQ)
      );
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}

// ==========================
// Connection Requests
// ==========================

// Create a connection request
// async createConnectionRequest(userId, targetUserId) {
//   try {
//     const connection = {
//       id: Date.now().toString(),
//       userId,
//       targetUserId,
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     };

//     // Add connection for requester
//     const userConnections = await this.getUserConnections(userId);
//     await this.updateUser(userId, {
//       'social.connections': [...userConnections, connection]
//     });

//     // Add "incoming" connection for target
//     const targetConnections = await this.getUserConnections(targetUserId);
//     await this.updateUser(targetUserId, {
//       'social.connections': [
//         ...targetConnections,
//         { ...connection, status: 'incoming' }
//       ]
//     });

//     return connection;
//   } catch (err) {
//     console.error('Error creating connection request:', err);
//     throw err;
//   }
// }

// // Get all connections of a user
// async getUserConnections(customUserId) {
//   try {
//     const user = await this.findUserByCustomId(customUserId);
//     return (user.social && user.social.connections) || [];
//   } catch (err) {
//     console.error('Error fetching user connections:', err);
//     return [];
//   }
// }

// // Update connection request status (accept/reject)
// async updateConnectionStatus(userId, targetUserId, status) {
//   try {
//     const user = await this.findUserByCustomId(userId);
//     const targetUser = await this.findUserByCustomId(targetUserId);

//     if (!user || !targetUser) throw new Error('User not found');

//     // Update requester’s record
//     const updatedUserConnections = (user.social.connections || []).map(conn =>
//       (conn.targetUserId === targetUserId || conn.userId === targetUserId)
//         ? { ...conn, status }
//         : conn
//     );

//     // Update target’s record
//     const updatedTargetConnections = (targetUser.social.connections || []).map(conn =>
//       (conn.targetUserId === userId || conn.userId === userId)
//         ? { ...conn, status }
//         : conn
//     );

//     await this.updateUser(userId, { 'social.connections': updatedUserConnections });
//     await this.updateUser(targetUserId, { 'social.connections': updatedTargetConnections });

//     return { success: true, status };
//   } catch (err) {
//     console.error('Error updating connection status:', err);
//     throw err;
//   }
// }


// Send connection request
async createConnectionRequest(senderId, receiverId) {
  try {
    const sender = await this.findUserByCustomId(senderId);
    const receiver = await this.findUserByCustomId(receiverId);

    if (!sender || !receiver) throw new Error("User not found");

    // Prevent duplicate requests or already connected
    if (
      sender.connections?.sent?.includes(receiverId) ||
      sender.social?.connected?.includes(receiverId)
    ) {
      throw new Error("Connection request already sent or already connected");
    }

    // Update sender (add to sent)
    await this.updateUser(senderId, {
      "connections.sent": [...(sender.connections?.sent || []), receiverId],
    });

    // Update receiver (add to received)
    await this.updateUser(receiverId, {
      "connections.received": [...(receiver.connections?.received || []), senderId],
    });

    return { success: true, message: "Connection request sent" };
  } catch (err) {
    console.error("Error creating connection request:", err);
    throw err;
  }
}

// Accept connection request
async acceptConnectionRequest(receiverId, senderId) {
  try {
    const sender = await this.findUserByCustomId(senderId);
    const receiver = await this.findUserByCustomId(receiverId);

    if (!sender || !receiver) throw new Error("User not found");

    // Remove from sent & received
    const updatedSenderSent = (sender.connections?.sent || []).filter(id => id !== receiverId);
    const updatedReceiverReceived = (receiver.connections?.received || []).filter(id => id !== senderId);

    // Add each other to connected
    const updatedSenderConnected = [...(sender.social?.connected || []), receiverId];
    const updatedReceiverConnected = [...(receiver.social?.connected || []), senderId];

    await this.updateUser(senderId, {
      "connections.sent": updatedSenderSent,
      "social.connected": updatedSenderConnected,
    });

    await this.updateUser(receiverId, {
      "connections.received": updatedReceiverReceived,
      "social.connected": updatedReceiverConnected,
    });

    return { success: true, message: "Connection request accepted" };
  } catch (err) {
    console.error("Error accepting connection request:", err);
    throw err;
  }
}

// Reject connection request
async rejectConnectionRequest(receiverId, senderId) {
  try {
    const sender = await this.findUserByCustomId(senderId);
    const receiver = await this.findUserByCustomId(receiverId);

    if (!sender || !receiver) throw new Error("User not found");

    // Remove from both sent and received
    const updatedSenderSent = (sender.connections?.sent || []).filter(id => id !== receiverId);
    const updatedReceiverReceived = (receiver.connections?.received || []).filter(id => id !== senderId);

    await this.updateUser(senderId, { "connections.sent": updatedSenderSent });
    await this.updateUser(receiverId, { "connections.received": updatedReceiverReceived });

    return { success: true, message: "Connection request rejected" };
  } catch (err) {
    console.error("Error rejecting connection request:", err);
    throw err;
  }
}

// Withdraw (cancel) request by sender
async withdrawConnectionRequest(senderId, receiverId) {
  try {
    const sender = await this.findUserByCustomId(senderId);
    const receiver = await this.findUserByCustomId(receiverId);

    if (!sender || !receiver) throw new Error("User not found");

    const updatedSenderSent = (sender.connections?.sent || []).filter(id => id !== receiverId);
    const updatedReceiverReceived = (receiver.connections?.received || []).filter(id => id !== senderId);

    await this.updateUser(senderId, { "connections.sent": updatedSenderSent });
    await this.updateUser(receiverId, { "connections.received": updatedReceiverReceived });

    return { success: true, message: "Connection request withdrawn" };
  } catch (err) {
    console.error("Error withdrawing connection request:", err);
    throw err;
  }
}



}

module.exports = new DynamoDBService(); 