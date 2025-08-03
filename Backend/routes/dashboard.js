const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const dynamoDBService = require('../services/dynamoDBService');

router.get('/dashboarddata', async (req, res) => {
  try {
    // Get userId from query (replace with auth in production)
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    console.log('Dashboard request for userId:', userId);

    // Get user data from DynamoDB
    const user = await userService.getUserByFirebaseUid(userId);
    
    if (!user) {
      console.log('User not found for UID:', userId);
      // Return default values if user not found
      return res.json({
        totalViews: 0,
        totalEarnings: 0,
        projectCount: 0,
        activities: [],
        connections: 0,
        favourites: 0
      });
    }

    console.log('User found:', user.customUserId);

    // Get user's projects from marketplace
    const customUserId = user.customUserId;
    const marketplace = await dynamoDBService.getMarketplaceData();
    
    console.log('Marketplace data retrieved, projects count:', marketplace.projects.length);
    
    // Find projects created by this user
    const userProjects = marketplace.projects.filter(p => 
      p.author === customUserId || p.customUserId === customUserId
    );

    console.log('User projects found:', userProjects.length);
    console.log('User projects:', userProjects.map(p => ({ title: p.title, author: p.author, customUserId: p.customUserId, views: p.views, price: p.price })));

    let totalViews = 0;
    let totalEarnings = 0;
    
    userProjects.forEach(project => {
      totalViews += project.views || 0;
      totalEarnings += project.price || 0; // Use price as earnings for now
    });

    console.log('Calculated totals - Views:', totalViews, 'Earnings:', totalEarnings);

    // Get optimized recent activities (only necessary fields for display)
    const activities = (user.activities && user.activities.recent) || [];
    const optimizedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      // Remove unnecessary metadata to reduce data size
    }));

    // Get connections and favourites count
    const connections = (user.social && user.social.connections) ? user.social.connections.length : 0;
    const favourites = (user.marketplace && user.marketplace.favorites) ? user.marketplace.favorites.length : 0;

    const response = {
      totalViews,
      totalEarnings,
      projectCount: userProjects.length,
      activities: optimizedActivities,
      connections,
      favourites
    };

    console.log('Dashboard response:', response);

    res.json(response);
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router; 