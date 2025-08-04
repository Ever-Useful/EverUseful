const express = require('express');
const router = express.Router();
const dynamoDBService = require('../services/dynamoDBService');
const userService = require('../services/userService');
//testing
// GET /api/admin/overview - total users, total projects, user growth
router.get('/overview', async (req, res) => {
  try {
    // Get all users from DynamoDB
    const users = await userService.getAllUsers();
    
    // Get all marketplace items from DynamoDB
    const marketplaceItems = await dynamoDBService.getAllMarketplaceItems();

    // Total users
    const totalUsers = users.length;

    // Total projects
    const totalProjects = marketplaceItems.length;

    // User growth (users created in the last 7 days)
    const now = new Date();
    const userGrowth = Array(7).fill(0);
    
    users.forEach(user => {
      const createdAt = user.createdAt || user.profile?.createdAt;
      if (createdAt) {
        const created = new Date(createdAt);
        const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          userGrowth[6 - diffDays] += 1; // 0 = today, 6 = 6 days ago
        }
      }
    });

    res.json({
      totalUsers,
      totalProjects,
      userGrowth
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin overview', details: err.message });
  }
});

module.exports = router; 