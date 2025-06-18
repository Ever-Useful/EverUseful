const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authorize = require('../authorize');

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
    await userService.loadUserData(); // Ensure userData is loaded
    const firebaseUid = req.user.uid;
    // DEBUG LOGGING
    const allUids = Object.values(userService.userData.users || {}).map(u => u.firebaseUid);
    console.log('Looking for firebaseUid:', firebaseUid, 'All UIDs:', allUids);
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        profile: user.profile,
        stats: user.stats,
        studentData: user.studentData || null
      }
    });
    console.log(firebaseUid, Object.values(userService.userData.users).map(u => u.firebaseUid))
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
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

    // Return public profile data only
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        profile: {
          name: user.profile.name,
          avatar: user.profile.avatar,
          bio: user.profile.bio,
          title: user.profile.title,
          location: user.profile.location,
          website: user.profile.website,
          userType: user.profile.userType,
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

// Update user profile
router.put('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedProfile = await userService.updateUserProfile(user.customUserId, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add project to user
router.post('/projects', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const project = await userService.addUserProject(user.customUserId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: project
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user projects
router.get('/projects', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Debug endpoint to get current user info
router.get('/debug/current-user', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    res.json({
      firebaseUid,
      userExists: !!user,
      user: user ? {
        customUserId: user.customUserId,
        name: user.profile?.name,
        email: user.profile?.email,
        skills: user.skills
      } : null
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user skills (flat array)
router.get('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name, email, picture } = req.user;
    console.log('Skills endpoint - Firebase UID:', firebaseUid);
    
    let user = userService.findUserByFirebaseUid(firebaseUid);
    console.log('Skills endpoint - User found:', user ? 'Yes' : 'No');
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('Skills endpoint - Creating new user for UID:', firebaseUid);
      try {
        const customUserId = await userService.generateCustomUserId();
        
        // Create user in userData.json
        await userService.createUser(firebaseUid, {
          name: name || 'Anonymous',
          email: email || 'no-email@example.com',
          avatar: picture || '',
          userType: 'student'
        });
        
        // Get the newly created user
        user = userService.findUserByFirebaseUid(firebaseUid);
        console.log('Skills endpoint - New user created:', user ? 'Yes' : 'No');
      } catch (createError) {
        console.error('Skills endpoint - Error creating user:', createError);
        return res.status(500).json({ success: false, message: 'Failed to create user' });
      }
    }
    
    if (!user) {
      console.log('Skills endpoint - User still not found after creation attempt');
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('Skills endpoint - User skills:', user.skills);
    // Return the flat skills array
    res.json(Array.isArray(user.skills) ? user.skills : []);
  } catch (error) {
    console.error('Skills endpoint - Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a skill (flat array)
router.post('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name: userName, email, picture } = req.user;
    let user = userService.findUserByFirebaseUid(firebaseUid);
    
    // If user doesn't exist, create them
    if (!user) {
      try {
        const customUserId = await userService.generateCustomUserId();
        
        // Create user in userData.json
        await userService.createUser(firebaseUid, {
          name: userName || 'Anonymous',
          email: email || 'no-email@example.com',
          avatar: picture || '',
          userType: 'student'
        });
        
        // Get the newly created user
        user = userService.findUserByFirebaseUid(firebaseUid);
      } catch (createError) {
        console.error('Add skill - Error creating user:', createError);
        return res.status(500).json({ success: false, message: 'Failed to create user' });
      }
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name required' });
    }
    await userService.addUserSkill(user.customUserId, { name });
    res.status(201).json({ success: true, message: 'Skill added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove a skill (flat array)
router.delete('/skills/:skillName', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name: userName, email, picture } = req.user;
    let user = userService.findUserByFirebaseUid(firebaseUid);
    
    // If user doesn't exist, create them
    if (!user) {
      try {
        const customUserId = await userService.generateCustomUserId();
        
        // Create user in userData.json
        await userService.createUser(firebaseUid, {
          name: userName || 'Anonymous',
          email: email || 'no-email@example.com',
          avatar: picture || '',
          userType: 'student'
        });
        
        // Get the newly created user
        user = userService.findUserByFirebaseUid(firebaseUid);
      } catch (createError) {
        console.error('Delete skill - Error creating user:', createError);
        return res.status(500).json({ success: false, message: 'Failed to create user' });
      }
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { skillName } = req.params;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name required' });
    }
    await userService.removeUserSkill(user.customUserId, skillName);
    res.json({ success: true, message: 'Skill removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const activity = await userService.addActivity(user.customUserId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user activities
router.get('/activities', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Follow user
router.post('/follow/:targetUserId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { targetUserId } = req.params;
    
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await userService.followUser(user.customUserId, targetUserId);
    
    res.json({
      success: true,
      message: 'User followed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user statistics
router.get('/stats', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = await userService.getUserStats(user.customUserId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user followers/following
router.get('/social/:type', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { type } = req.params; // 'followers' or 'following'
    
    const user = userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (type !== 'followers' && type !== 'following') {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Use "followers" or "following"'
      });
    }

    const userIds = user.social[type];
    const users = userIds.map(id => {
      const userData = userService.findUserByCustomId(id);
      return userData ? {
        customUserId: userData.customUserId,
        name: userData.profile.name,
        avatar: userData.profile.avatar,
        title: userData.profile.title,
        userType: userData.profile.userType
      } : null;
    }).filter(Boolean);

    res.json({
      success: true,
      data: {
        users,
        count: user.social[`${type}Count`]
      }
    });
  } catch (error) {
    console.error('Error fetching social data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
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