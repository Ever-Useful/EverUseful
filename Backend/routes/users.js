const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authorize = require('../authorize');
const admin = require('firebase-admin');
const db = admin.firestore();

// Create new user (called after Firebase authentication)
router.post('/create', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userData = req.body;

    const newUser = await userService.createUser(firebaseUid, userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user profile by Firebase UID
router.get('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch auth info from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const firestoreUser = userSnap.data();
    const customUserId = firestoreUser.customUserId;
    // Fetch extended info from userData.json
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in userData.json' });
    }

    res.json({
      success: true,
      data: {
        customUserId,
        auth: {
          firstName: user.profile.firstName || firestoreUser.firstName,
          lastName: user.profile.lastName || firestoreUser.lastName,
          phoneNumber: user.profile.mobile || firestoreUser.phoneNumber,
          email: user.profile.email || firestoreUser.email,
          userType: user.profile.userType || firestoreUser.userType,
          username: user.profile.username,
          mobile: user.profile.mobile,
          gender: user.profile.gender,
          domain: user.profile.domain,
          purpose: user.profile.purpose,
          role: user.profile.role,
        },
        profile: {
          bio: user.profile.bio,
          location: user.profile.location,
          website: user.profile.website,
          title: user.profile.title,
          avatar: user.profile.avatar,
          createdAt: user.profile.createdAt,
          updatedAt: user.profile.updatedAt,
        },
        education: user.education || [],
        workExperience: user.workExperience || [],
        personalDetails: user.personalDetails || {},
        socialLinks: user.socialLinks || {},
        stats: user.stats || {},
        studentData: user.studentData || null,
        professorData: user.professorData || null,
        freelancerData: user.freelancerData || null,
        skills: user.skills || []
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user skills (flat array)
router.get('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      console.log('[GET /skills] Firestore user not found for firebaseUid:', firebaseUid);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found in userData.json for customUserId: ${customUserId}. Available user keys: ${Object.keys(userService.userData.users).join(', ')}` });
    }
    res.json({ success: true, data: Array.isArray(user.skills) ? user.skills : [] });
  } catch (error) {
    console.error('Skills endpoint - Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a skill (flat array)
router.post('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      console.log('[POST /skills] Firestore user not found for firebaseUid:', firebaseUid);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found in userData.json for customUserId: ${customUserId}. Available user keys: ${Object.keys(userService.userData.users).join(', ')}` });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name required' });
    }
    await userService.addUserSkill(customUserId, { name });
    res.status(201).json({ success: true, message: 'Skill added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove a skill (flat array)
router.delete('/skills/:skillName', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { skillName } = req.params;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name required' });
    }
    await userService.removeUserSkill(customUserId, skillName);
    res.json({ success: true, message: 'Skill removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add project to user
router.post('/projects', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const project = await userService.addUserProject(customUserId, req.body);
    res.status(201).json({ success: true, message: 'Project added successfully', data: project });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user projects
router.get('/projects', authorize, async (req, res) => {
  try {
    console.log('=== GET /api/users/projects DEBUGGING ===');
    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      console.log('User not found in Firestore');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    console.log('Custom User ID:', customUserId);
    
    try {
      await userService.loadUserData();
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Error loading user data:', error);
      return res.status(500).json({ success: false, message: 'Failed to load user data' });
    }
    
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      console.log('User not found in userData.json');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('User projects:', user.projects);
    console.log('=== END GET /api/users/projects DEBUGGING ===');
    
    res.json({
      success: true,
      data: {
        created: user.projects.created,
        collaborated: user.projects.collaborated,
        favorites: user.projects.favorites,
        count: user.projects.count
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user by custom ID
router.get('/:customUserId', async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    // Load user data from JSON file first
    await userService.loadUserData();
    
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return full public profile data
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        profile: {
          avatar: user.profile.avatar,
          bio: user.profile.bio,
          title: user.profile.title,
          location: user.profile.location,
          website: user.profile.website,
          createdAt: user.profile.createdAt,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          userType: user.profile.userType
        },
        stats: user.stats,
        social: {
          followersCount: user.social.followersCount,
          followingCount: user.social.followingCount
        },
        skills: user.skills,
        studentData: user.studentData,
        projects: user.projects.created // recent or all created projects
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user auth info (firstName, lastName, phoneNumber, userType)
router.put('/auth', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedProfile = await userService.updateUserAuthInfo(customUserId, req.body);
    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error('Error updating auth info:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update user profile (extended info)
router.put('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedProfile = await userService.updateUserProfile(customUserId, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Debug endpoint to get current user info
router.get('/debug/current-user', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.json({ firebaseUid, userExists: false, user: null });
    }
    const customUserId = userSnap.data().customUserId;
    const user = userService.findUserByCustomId(customUserId);
    res.json({
      firebaseUid,
      userExists: !!user,
      user: user ? {
        customUserId: user.customUserId,
        skills: user.skills
      } : null
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to cart (by customUserId)
router.post('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    const productData = req.body;
    
    // Load user data from JSON file
    await userService.loadUserData();
    
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const cart = await userService.addToCart(customUserId, productData);
    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user cart (by customUserId)
router.get('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    console.log('=== CART DEBUGGING ===');
    console.log('Requested customUserId:', customUserId);
    
    // Load user data from JSON file
    await userService.loadUserData();
    console.log('Available users in userData.json:', Object.keys(userService.userData?.users || {}));
    
    const user = userService.findUserByCustomId(customUserId);
    console.log('User found:', !!user);
    console.log('=== END CART DEBUGGING ===');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user.marketplace.cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Remove item from cart
router.delete('/:customUserId/cart/:productId', authorize, async (req, res) => {
  try {
    const { customUserId, productId } = req.params;
    
    // Load user data from JSON file
    await userService.loadUserData();
    
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const cart = await userService.removeFromCart(customUserId, productId);
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Clear cart
router.delete('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    // Load user data from JSON file
    await userService.loadUserData();
    
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    await userService.clearCart(customUserId);
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add activity
router.post('/activities', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const activity = await userService.addActivity(customUserId, req.body);
    res.status(201).json({ success: true, message: 'Activity added successfully', data: activity });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user activities
router.get('/activities', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: {
        recent: user.activities.recent,
        achievements: user.activities.achievements,
        badges: user.activities.badges,
        points: user.activities.points
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Follow user
router.post('/follow/:targetUserId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { targetUserId } = req.params;
    const result = await userService.followUser(customUserId, targetUserId);
    res.json({ success: true, message: 'User followed successfully', data: result });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user statistics
router.get('/stats', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const stats = await userService.getUserStats(customUserId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user followers/following
router.get('/social/:type', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    // Fetch customUserId from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { type } = req.params; // 'followers' or 'following'
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (type !== 'followers' && type !== 'following') {
      return res.status(400).json({ success: false, message: 'Invalid type. Use "followers" or "following"' });
    }
    const userIds = user.social[type];
    const users = userIds.map(id => {
      const userData = userService.findUserByCustomId(id);
      return userData ? {
        customUserId: userData.customUserId,
        avatar: userData.profile.avatar,
        title: userData.profile.title
      } : null;
    }).filter(Boolean);
    res.json({ success: true, data: { users, count: user.social[`${type}Count`] } });
  } catch (error) {
    console.error('Error fetching social data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin route - Get all users (protected)
router.get('/admin/all', authorize, async (req, res) => {
  try {
    // Add admin check here if needed
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user (admin only)
router.delete('/admin/:customUserId', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    // Add admin check here if needed
    const result = await userService.deleteUser(customUserId);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add projectId to user's created projects (public endpoint for backend integration)
router.post('/:customUserId/projects', async (req, res) => {
  try {
    const { customUserId } = req.params;
    const { projectId, projectData } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is required' });
    }
    
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if project ID is already in the created array
    if (!user.projects.created.includes(projectId)) {
      // Add projectId to created array
      user.projects.created.push(projectId);
      user.projects.count += 1;
      user.stats.projectsCount += 1;
      
      // If full project data is provided, also add it using addUserProject
      if (projectData) {
        try {
          await userService.addUserProject(customUserId, {
            projectId: projectId,
            ...projectData
          });
        } catch (error) {
          console.warn('Failed to add full project data:', error);
          // Continue with just the project ID
        }
      }
      
      await userService.saveUserData();
      console.log(`Project ID ${projectId} added to user ${customUserId}`);
    } else {
      console.log(`Project ID ${projectId} already exists for user ${customUserId}`);
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Project ID added to user', 
      data: { projectId } 
    });
  } catch (error) {
    console.error('Error adding projectId to user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Remove projectId from user's created projects
router.delete('/:customUserId/projects/:projectId', async (req, res) => {
  try {
    const { customUserId, projectId } = req.params;
    
    console.log(`=== REMOVE PROJECT ID DEBUGGING ===`);
    console.log(`Removing project ID ${projectId} from user ${customUserId}`);
    
    const removed = await userService.removeUserProject(customUserId, projectId);
    
    if (removed) {
      console.log(`Project ID ${projectId} successfully removed from user ${customUserId}`);
      res.json({ 
        success: true, 
        message: 'Project ID removed from user',
        data: { projectId: parseInt(projectId) }
      });
    } else {
      console.log(`Project ID ${projectId} not found for user ${customUserId}`);
      res.status(404).json({ 
        success: false, 
        message: 'Project ID not found in user\'s created projects' 
      });
    }
    
    console.log(`=== END REMOVE PROJECT ID DEBUGGING ===`);
  } catch (error) {
    console.error('Error removing projectId from user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user student data
router.put('/student-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedStudentData = await userService.updateStudentData(customUserId, req.body);
    res.json({ success: true, data: updatedStudentData });
  } catch (error) {
    console.error('Error updating student data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update professor data
router.put('/professor-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedProfessorData = await userService.updateProfessorData(customUserId, req.body);
    res.json({ success: true, data: updatedProfessorData });
  } catch (error) {
    console.error('Error updating professor data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update freelancer data
router.put('/freelancer-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedFreelancerData = await userService.updateFreelancerData(customUserId, req.body);
    res.json({ success: true, data: updatedFreelancerData });
  } catch (error) {
    console.error('Error updating freelancer data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Education routes
router.post('/education', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const newEducation = await userService.addEducation(customUserId, req.body);
    res.status(201).json({ success: true, data: newEducation });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/education/:educationId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { educationId } = req.params;
    const updatedEducation = await userService.updateEducation(customUserId, educationId, req.body);
    res.json({ success: true, data: updatedEducation });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/education/:educationId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { educationId } = req.params;
    await userService.deleteEducation(customUserId, educationId);
    res.json({ success: true, message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Work Experience routes
router.post('/work-experience', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const newWork = await userService.addWorkExperience(customUserId, req.body);
    res.status(201).json({ success: true, data: newWork });
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/work-experience/:workId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { workId } = req.params;
    const updatedWork = await userService.updateWorkExperience(customUserId, workId, req.body);
    res.json({ success: true, data: updatedWork });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/work-experience/:workId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { workId } = req.params;
    await userService.deleteWorkExperience(customUserId, workId);
    res.json({ success: true, message: 'Work experience record deleted successfully' });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Personal Details routes
router.put('/personal-details', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedPersonalDetails = await userService.updatePersonalDetails(customUserId, req.body);
    res.json({ success: true, data: updatedPersonalDetails });
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Social Links routes
router.put('/social-links', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedSocialLinks = await userService.updateSocialLinks(customUserId, req.body);
    res.json({ success: true, data: updatedSocialLinks });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router; 