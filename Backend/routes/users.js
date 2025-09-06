const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const userService = require('../services/userService');

// Get user profile
router.get('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    console.log('Profile endpoint - Firebase UID:', firebaseUid);
    console.log('Profile endpoint - User from token:', req.user);
    
    // Fetch user from DynamoDB using Firebase UID
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    console.log('Profile endpoint - Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      // Create new user in DynamoDB
      const { name, email } = req.user;
      console.log('Profile endpoint - Creating new user with data:', { name, email });
      
      // Parse firstName and lastName from name if available
      let firstName = '';
      let lastName = '';
      if (name) {
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      try {
        const newUser = await userService.createUser(firebaseUid, {
          firstName: firstName,
          lastName: lastName,
          email: email || 'no-email@example.com',
          userType: 'student',
          mobile: '',
          phoneNumber: ''
        });
        
        user = await userService.findUserByFirebaseUid(firebaseUid);
        console.log('Profile endpoint - New user created:', user.customUserId);
      } catch (createError) {
        console.error('Profile endpoint - Error creating user:', createError);
        return res.status(500).json({ success: false, message: 'Failed to create user' });
      }
    }
    
    // Ensure proper data structure
    const profile = user.profile || {};
    const auth = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
      email: profile.email || '',
      userType: profile.userType || '',
      mobile: profile.mobile || '',
      gender: profile.gender || '',
      username: profile.username || profile.email?.split('@')[0] || ''
    };
    
    console.log('Profile endpoint - Auth data being sent:', auth);
    console.log('Profile endpoint - Profile data being sent:', profile);
    
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        auth: auth,
        profile: profile,
        stats: user.stats || {},
        studentData: user.studentData || null,
        education: user.education || [],
        workExperience: user.workExperience || [],
        skills: user.skills || [],
        freelancerData: user.freelancerData || null,
        professorData: user.professorData || null,
        personalDetails: user.personalDetails || {},
        socialLinks: user.socialLinks || {},
        projects: user.projects || { created: [], collaborated: [], favorites: [], count: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get bulk users by custom user IDs (for marketplace author display)
router.get('/bulk/:userIds', async (req, res) => {
  try {
    const { userIds } = req.params;
    const userIdArray = userIds.split(',').filter(id => id.trim());
    
    if (userIdArray.length === 0) {
      return res.json({ success: true, data: {} });
    }
    
    const users = {};
    for (const customUserId of userIdArray) {
      try {
        const user = await userService.findUserByCustomId(customUserId);
        if (user) {
          // Ensure proper data structure for frontend
          const profile = user.profile || {};
          const auth = {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phoneNumber: profile.phoneNumber || '',
            email: profile.email || '',
            userType: profile.userType || '',
            mobile: profile.mobile || '',
            gender: profile.gender || '',
            username: profile.username || profile.email?.split('@')[0] || ''
          };
          
          users[customUserId] = {
            ...user,
            auth: auth,
            profile: profile
          };
        }
      } catch (error) {
        console.error(`Error fetching user ${customUserId}:`, error);
      }
    }
    
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching bulk users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user skills
router.get('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: Array.isArray(user.skills) ? user.skills : [] });
  } catch (error) {
    console.error('Skills endpoint - Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a skill
router.post('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
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

// Remove a skill
router.delete('/skills/:skillName', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
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

// Add project to user
router.post('/projects', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const project = await userService.addUserProject(user.customUserId, req.body);
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
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get marketplace data to fetch actual project details
    const dynamoDBService = require('../services/dynamoDBService');
    const marketplace = await dynamoDBService.getMarketplaceData();
    
    // Find projects created by this user (same logic as dashboard)
    const customUserId = user.customUserId;
    const userProjects = marketplace.projects.filter(p => 
      p.author === customUserId || p.customUserId === customUserId
    );
    

    
    // Return the actual project data, not just IDs
    res.json({ 
      success: true, 
      data: { 
        created: userProjects,
        collaborated: [], // Can be implemented later
        favorites: [], // Can be implemented later
        count: userProjects.length 
      } 
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedProfile = await userService.updateUserProfile(user.customUserId, req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update student data
router.put('/student-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedData = await userService.updateStudentData(user.customUserId, req.body);
    res.json({ success: true, message: 'Student data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating student data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update professor data
router.put('/professor-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedData = await userService.updateProfessorData(user.customUserId, req.body);
    res.json({ success: true, message: 'Professor data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating professor data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update freelancer data
router.put('/freelancer-data', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedData = await userService.updateFreelancerData(user.customUserId, req.body);
    res.json({ success: true, message: 'Freelancer data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating freelancer data:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add education
router.post('/education', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const education = await userService.addEducation(user.customUserId, req.body);
    res.status(201).json({ success: true, message: 'Education added successfully', data: education });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update education
router.put('/education/:educationId', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);

    if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    
    const { educationId } = req.params;
    const updatedEducation = await userService.updateEducation(user.customUserId, educationId, req.body);
    res.json({ success: true, message: 'Education updated successfully', data: updatedEducation });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete education
router.delete('/education/:educationId', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);

    if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    
    const { educationId } = req.params;
    await userService.deleteEducation(user.customUserId, educationId);
    res.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(400).json({ success: false, message: error.message });
    }
});

// Add work experience
router.post('/work-experience', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const workExperience = await userService.addWorkExperience(user.customUserId, req.body);
    res.status(201).json({ success: true, message: 'Work experience added successfully', data: workExperience });
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update work experience
router.put('/work-experience/:workId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { workId } = req.params;
    const updatedWork = await userService.updateWorkExperience(user.customUserId, workId, req.body);
    res.json({ success: true, message: 'Work experience updated successfully', data: updatedWork });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete work experience
router.delete('/work-experience/:workId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { workId } = req.params;
    await userService.deleteWorkExperience(user.customUserId, workId);
    res.json({ success: true, message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update personal details
router.put('/personal-details', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedDetails = await userService.updatePersonalDetails(user.customUserId, req.body);
    res.json({ success: true, message: 'Personal details updated successfully', data: updatedDetails });
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update social links
router.put('/social-links', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const updatedLinks = await userService.updateSocialLinks(user.customUserId, req.body);
    res.json({ success: true, message: 'Social links updated successfully', data: updatedLinks });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Follow/unfollow user
router.post('/follow', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }
    
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Add to following list
    await userService.followUser(user.customUserId, targetUserId);
        
    res.json({ success: true, message: 'Connection request sent successfully' });
        } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Schedule meeting
router.post('/meetings', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const meetingData = req.body;

    const user = await userService.findUserByFirebaseUid(firebaseUid);
    if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    
    // Add meeting to user's meetings (you might want to create a separate meetings table)
    const meetingId = Date.now().toString();
    const meeting = {
      id: meetingId,
      ...meetingData,
      createdBy: user.customUserId,
      createdAt: new Date().toISOString()
    };
    
    // For now, we'll store meetings in the user's data
    // In a production app, you'd want a separate meetings table
    await userService.addActivity(user.customUserId, {
      type: 'meeting_scheduled',
      description: `Scheduled meeting: ${meetingData.title}`,
      // Only save necessary fields for dashboard display
    });
    
    res.json({ success: true, message: 'Meeting scheduled successfully', data: meeting });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create user endpoint (for frontend compatibility)
router.post('/create', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const { firstName, lastName, email, userType, phoneNumber } = req.body;
    
    // Check if user already exists
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (user) {
      return res.status(200).json({ 
            success: true,
        message: 'User already exists',
        data: {
          customUserId: user.customUserId,
          profile: user.profile
        }
      });
    }
    
    // Create new user
    const newUser = await userService.createUser(firebaseUid, {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || req.user.email || 'no-email@example.com',
      userType: userType || 'student',
      mobile: phoneNumber || '',
      phoneNumber: phoneNumber || ''
    });
    

    
    res.status(201).json({ 
            success: true,
      message: 'User created successfully',
      data: {
        customUserId: newUser.customUserId,
        profile: newUser.profile
      }
        });
    } catch (error) {
    console.error('Create endpoint - Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user auth info
router.put('/auth', authorize, async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
    const { firstName, lastName, phoneNumber, userType } = req.body;

    const user = await userService.findUserByFirebaseUid(firebaseUid);
    if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (userType !== undefined) updateData.userType = userType;
    await userService.updateUserProfile(user.customUserId, updateData);
    
    res.json({ success: true, message: 'Auth info updated successfully' });
    } catch (error) {
    console.error('Error updating auth info:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all users (for collaborators page) - must be before parameterized routes
router.get('/all', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// users.js
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const users = await userService.searchUsers(q);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// // Send connection request
// router.post('/connections', authorize, async (req, res) => {
//   const firebaseUid = req.user.uid;
//   const { targetUserId } = req.body;

//   const user = await userService.findUserByFirebaseUid(firebaseUid);
//   if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//   const connection = await userService.sendConnectionRequest(user.customUserId, targetUserId);

//   // 🔴 Emit socket event
//   req.app.get('io').to(targetUserId).emit('connection_request', connection);

//   res.json({ success: true, data: connection });
// });

// // Get all connections for logged-in user
// router.get('/connections', authorize, async (req, res) => {
//   const firebaseUid = req.user.uid;
//   const user = await userService.findUserByFirebaseUid(firebaseUid);

//   const connections = await userService.getConnections(user.customUserId);
//   res.json({ success: true, data: connections });
// });

// // Accept/reject connection
// router.put('/connections/:targetUserId', authorize, async (req, res) => {
//   try {
//     const firebaseUid = req.user.uid;
//     const { targetUserId } = req.params;
//     const { status } = req.body; // accepted | rejected

//     const user = await userService.findUserByFirebaseUid(firebaseUid);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const updated = await userService.respondToConnection(
//       user.customUserId,   // requester (logged-in user)
//       targetUserId,        // the user they’re responding to
//       status
//     );

//     //  Notify both users
//     req.app.get('io')
//       .to(user.customUserId)
//       .to(targetUserId)
//       .emit('connection_update', updated);

//     res.json({ success: true, data: updated });
//   } catch (error) {
//     console.error("Error updating connection status:", error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });



// ----------------------------
// Send connection request
// ----------------------------
router.post('/connections', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { targetUserId } = req.body;

    const user = await userService.findUserByFirebaseUid(firebaseUid);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const connection = await userService.sendConnectionRequest(user.customUserId, targetUserId);

    // 🔴 Notify receiver in real-time
    req.app.get('io').to(targetUserId).emit('connection_request', {
      from: user.customUserId,
      ...connection,
    });

    res.json({ success: true, data: connection });
  } catch (err) {
    console.error("Error sending connection request:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------
// Get all connections
// ----------------------------
router.get('/connections', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const connections = await userService.getConnections(user.customUserId);
    res.json({ success: true, data: connections });
  } catch (err) {
    console.error("Error fetching connections:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------
// Accept a connection request
// ----------------------------
router.put('/connections/:senderId/accept', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { senderId } = req.params;

    const receiver = await userService.findUserByFirebaseUid(firebaseUid);
    if (!receiver) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await userService.acceptConnectionRequest(receiver.customUserId, senderId);

    // Notify both users
    req.app.get('io')
      .to(receiver.customUserId)
      .to(senderId)
      .emit('connection_update', result);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error accepting connection:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------
// Reject a connection request
// ----------------------------
router.put('/connections/:senderId/reject', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { senderId } = req.params;

    const receiver = await userService.findUserByFirebaseUid(firebaseUid);
    if (!receiver) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await userService.rejectConnectionRequest(receiver.customUserId, senderId);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error rejecting connection:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------
// Withdraw (cancel) a request
// ----------------------------
router.delete('/connections/:receiverId', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { receiverId } = req.params;

    const sender = await userService.findUserByFirebaseUid(firebaseUid);
    if (!sender) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await userService.withdrawConnectionRequest(sender.customUserId, receiverId);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error withdrawing connection:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});




// Get user by customUserId (for public profile viewing)
router.get('/:customUserId', async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    if (!customUserId) {
      return res.status(400).json({ success: false, message: 'Custom user ID is required' });
    }
    
    const user = await userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return public profile data (excluding sensitive information)
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        auth: {
          firstName: user.profile.firstName || '',
          lastName: user.profile.lastName || '',
          email: user.profile.email || '',
          userType: user.profile.userType || '',
          mobile: user.profile.mobile || '',
          gender: user.profile.gender || ''
        },
        profile: user.profile || {},
        stats: user.stats || {},
        studentData: user.studentData || null,
        education: user.education || [],
        workExperience: user.workExperience || [],
        skills: user.skills || [],
        freelancerData: user.freelancerData || null,
        professorData: user.professorData || null,
        personalDetails: user.personalDetails || {},
        socialLinks: user.socialLinks || {},
        projects: user.projects || { created: [], collaborated: [], favorites: [], count: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching user by customUserId:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Cart endpoints
// Add item to cart
router.post('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    
    // Verify the user exists
    const user = await userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Add item to cart
    await userService.addToCart(customUserId, { productId, quantity });
    
    // Get updated cart
    const updatedCart = await userService.getUserCart(customUserId);
    
    res.status(201).json({ success: true, message: 'Item added to cart successfully', data: updatedCart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user cart
router.get('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    // Verify the user exists
    const user = await userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user cart
    const cart = await userService.getUserCart(customUserId);
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error getting user cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:customUserId/cart/:productId', authorize, async (req, res) => {
  try {
    const { customUserId, productId } = req.params;
    
    // Verify the user exists
    const user = await userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Remove item from cart
    await userService.removeFromCart(customUserId, productId);
    
    // Get updated cart
    const updatedCart = await userService.getUserCart(customUserId);
    
    res.json({ success: true, message: 'Item removed from cart successfully', data: updatedCart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Clear cart
router.delete('/:customUserId/cart', authorize, async (req, res) => {
  try {
    const { customUserId } = req.params;
    
    // Verify the user exists
    const user = await userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Clear cart
    await userService.clearCart(customUserId);
    
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router; 