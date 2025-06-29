const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const userService = require('../services/userService');

// Helper to load JSON data
function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', file), 'utf-8'));
}

router.get('/dashboarddata', (req, res) => {
  try {
    // For now, get userId from query for testing (replace with auth in production)
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const userData = loadJson('userData.json');
    const marketplace = loadJson('marketplace.json');

    // Find the user by Firebase UID or customUserId
    let user = null;
    for (const [customId, userInfo] of Object.entries(userData.users)) {
      // Check if this user has the Firebase UID in their firebaseUid field
      if (userInfo.firebaseUid === userId) {
        user = userInfo;
        break;
      }
      // Also check by customUserId
      if (userInfo.customUserId === userId) {
        user = userInfo;
        break;
      }
    }

    if (!user) {
      console.log('User not found for UID:', userId);
      console.log('Available users:', Object.keys(userData.users));
      
      // For testing purposes, use USER_000005 which has projects
      if (userData.users['USER_000005']) {
        console.log('Using USER_000005 for testing (has projects)');
        user = userData.users['USER_000005'];
      } else {
        // If user not found and no users exist, return default values
        return res.json({
          totalViews: 0,
          totalEarnings: 0,
          projectCount: 0,
          activities: [],
          connections: 0,
          favourites: 0
        });
      }
    }

    const projectIds = (user.projects && user.projects.created) || [];
    let totalViews = 0;
    let totalEarnings = 0;
    
    projectIds.forEach(pid => {
      const project = marketplace.projects.find(p => String(p.id) === String(pid));
      if (project) {
        totalViews += project.views || 0;
        totalEarnings += project.price || 0; // Use price as earnings for now
      }
    });

    const activities = (user.activities && user.activities.recent) || [];
    const connections = (user.social && user.social.connections) ? user.social.connections.length : 0;
    const favourites = (user.marketplace && user.marketplace.favorites) ? user.marketplace.favorites.length : 0;

    res.json({
      totalViews,
      totalEarnings,
      projectCount: projectIds.length,
      activities,
      connections,
      favourites
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router; 