const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authorize = require('../authorize');
const admin = require('firebase-admin');
const db = admin.firestore();

// Minimal test endpoint to verify router is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Users router is working!' });
});

// GET all users (for FindExpert page)
router.get('/all', async (req, res) => {
  try {
    await userService.loadUserData();
    res.json({ users: userService.userData.users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user profile by Firebase UID (must come before /:customUserId)
router.get('/profile', authorize, async (req, res) => {
  try {
    console.log('Profile endpoint called with user:', req.user);
    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    // Fetch auth info from Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    console.log('User exists in Firestore:', userSnap.exists);
    
    let firestoreUser, customUserId;
    
    if (!userSnap.exists) {
      // User doesn't exist in Firestore, create a basic record
      console.log('User not found in Firestore, creating basic record for:', firebaseUid);
      customUserId = `USER_${Date.now()}`;
      firestoreUser = {
        customUserId,
        firstName: req.user.displayName?.split(' ')[0] || 'User',
        lastName: req.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: req.user.email || '',
        phoneNumber: req.user.phoneNumber || '',
        userType: 'student' // default user type
      };
      
      console.log('Creating Firestore user:', firestoreUser);
      // Save to Firestore
      await userRef.set(firestoreUser);
      console.log('User saved to Firestore successfully');
    } else {
      firestoreUser = userSnap.data();
      customUserId = firestoreUser.customUserId;
      console.log('Found existing user in Firestore:', firestoreUser);
    }
    
    // Fetch extended info from userData.json
    console.log('Loading userData.json...');
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    console.log('User found in userData.json:', !!user);
    
    if (!user) {
      // User doesn't exist in userData.json, return basic data
      console.log('User not found in userData.json, returning basic data for:', customUserId);
      return res.json({
        success: true,
        data: {
          customUserId,
          auth: {
            firstName: firestoreUser.firstName || 'User',
            lastName: firestoreUser.lastName || '',
            phoneNumber: firestoreUser.phoneNumber || '',
            email: firestoreUser.email || '',
            userType: firestoreUser.userType || 'student',
            username: '',
            mobile: firestoreUser.phoneNumber || '',
            gender: '',
            domain: '',
            purpose: '',
            role: '',
          },
          profile: {
            bio: '',
            location: '',
            website: '',
            title: '',
            avatar: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          education: [],
          workExperience: [],
          personalDetails: {},
          socialLinks: {},
          stats: {},
          studentData: null,
          professorData: null,
          freelancerData: null,
          skills: []
        }
      });
    }
    
    console.log('Returning complete user data');
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
        skills: user.skills || [],
        projects: user.projects || { created: [], collaborated: [], favorites: [], count: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user by customUserId (for profile pages) - must come after /profile
router.get('/:customUserId', async (req, res) => {
  try {
    const { customUserId } = req.params;
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        customUserId,
        auth: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          phoneNumber: user.profile?.mobile,
          email: user.profile?.email,
          userType: user.profile?.userType,
          username: user.profile?.username,
          mobile: user.profile?.mobile,
          gender: user.profile?.gender,
          domain: user.profile?.domain,
          purpose: user.profile?.purpose,
          role: user.profile?.role,
        },
        profile: {
          bio: user.profile?.bio,
          location: user.profile?.location,
          website: user.profile?.website,
          title: user.profile?.title,
          avatar: user.profile?.avatar,
          createdAt: user.profile?.createdAt,
          updatedAt: user.profile?.updatedAt,
        },
        education: user.education || [],
        workExperience: user.workExperience || [],
        personalDetails: user.personalDetails || {},
        socialLinks: user.socialLinks || {},
        stats: user.stats || {},
        studentData: user.studentData || null,
        professorData: user.professorData || null,
        freelancerData: user.freelancerData || null,
        skills: user.skills || [],
        projects: user.projects || { created: [], collaborated: [], favorites: [], count: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching user by customUserId:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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

// Education endpoints
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
    res.json({ success: true, data: newEducation });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/education/:id', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedEducation = await userService.updateEducation(customUserId, req.params.id, req.body);
    res.json({ success: true, data: updatedEducation });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/education/:id', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    await userService.deleteEducation(customUserId, req.params.id);
    res.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Work Experience endpoints
router.post('/work', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const newWork = await userService.addWorkExperience(customUserId, req.body);
    res.json({ success: true, data: newWork });
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/work/:id', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const updatedWork = await userService.updateWorkExperience(customUserId, req.params.id, req.body);
    res.json({ success: true, data: updatedWork });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/work/:id', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    await userService.deleteWorkExperience(customUserId, req.params.id);
    res.json({ success: true, message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Personal Details endpoints
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

// Social Links endpoints
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

// Get user stats
router.get('/stats', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const stats = await userService.getUserStats(customUserId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// --- SKILLS ENDPOINTS ---
// Get current user's skills
router.get('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, skills: user.skills || [] });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a skill to current user
router.post('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }
    const skills = await userService.addUserSkill(customUserId, { name });
    res.json({ success: true, skills });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove a skill from current user
router.delete('/skills', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const userRef = db.collection('users').doc(firebaseUid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const customUserId = userSnap.data().customUserId;
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }
    const skills = await userService.removeUserSkill(customUserId, name);
    res.json({ success: true, skills });
  } catch (error) {
    console.error('Error removing skill:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router; 