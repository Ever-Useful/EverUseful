const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const userService = require('../services/userService');

// Get user profile
router.get('/profile', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    console.log('Profile endpoint - Firebase UID:', firebaseUid);
    
    // Fetch user from DynamoDB using Firebase UID
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      console.log('Profile endpoint - User not found in DynamoDB, creating new user...');
      
      // Create new user in DynamoDB
      const { name, email } = req.user;
      
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
        console.log('Profile endpoint - New user created successfully:', newUser.customUserId);
      } catch (createError) {
        console.error('Profile endpoint - Error creating user:', createError);
        return res.status(500).json({ success: false, message: 'Failed to create user' });
      }
    }
    
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        auth: {
          firstName: user.profile.firstName || '',
          lastName: user.profile.lastName || '',
          phoneNumber: user.profile.phoneNumber || '',
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
    console.error('Error fetching user profile:', error);
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
    
    res.json({ success: true, data: user.projects || { created: [], collaborated: [], favorites: [], count: 0 } });
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

// Get user by custom ID (for public profiles)
router.get('/:customUserId', async (req, res) => {
  try {
    const { customUserId } = req.params;
    const user = await userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Return only public information
    res.json({
      success: true,
      data: {
        customUserId: user.customUserId,
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          title: user.profile.title,
          bio: user.profile.bio,
          location: user.profile.location,
          avatar: user.profile.avatar
        },
        stats: user.stats,
        skills: user.skills,
        projects: user.projects
      }
    });
  } catch (error) {
    console.error('Error fetching user by custom ID:', error);
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
    
    console.log('Create endpoint - New user created successfully:', newUser.customUserId);
    
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

module.exports = router; 