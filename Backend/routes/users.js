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
    res.json({
      success: true,
      data: {
        customUserId,
        auth: {
          firstName: firestoreUser.firstName,
          lastName: firestoreUser.lastName,
          phoneNumber: firestoreUser.phoneNumber,
          email: firestoreUser.email,
          userType: firestoreUser.userType
        },
        profile: user ? user.profile : {},
        stats: user ? user.stats : {},
        studentData: user && user.studentData ? user.studentData : null
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

// Get user by custom ID
router.get('/:customUserId', async (req, res) => {
  try {
    const { customUserId } = req.params;
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return public profile data only (no name, email, or userType)
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
          createdAt: user.profile.createdAt
        },
        stats: user.stats,
        social: {
          followersCount: user.social.followersCount,
          followingCount: user.social.followingCount
        }
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
    const updateFields = {};
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'userType'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    }
    await userRef.update(updateFields);
    res.json({ success: true, message: 'Auth info updated successfully' });
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
    const user = userService.findUserByCustomId(customUserId);
    
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

module.exports = router; 