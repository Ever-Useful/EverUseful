const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper to read JSON files
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', filePath), 'utf-8'));
}

// GET /api/admin/overview - total users, total projects, user growth
router.get('/overview', (req, res) => {
  try {
    const userData = readJson('userData.json');
    const marketplace = readJson('marketplace.json');

    // Total users from userCounter
    const totalUsers = userData.userCounter || 0;

    // Total projects from projects array
    const totalProjects = Array.isArray(marketplace.projects) ? marketplace.projects.length : 0;

    // User growth (users created in the last 7 days)
    const now = new Date();
    const userGrowth = Array(7).fill(0);
    if (userData.users) {
      Object.values(userData.users).forEach(user => {
        const createdAt = user.profile && user.profile.createdAt;
        if (createdAt) {
          const created = new Date(createdAt);
          const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            userGrowth[6 - diffDays] += 1; // 0 = today, 6 = 6 days ago
          }
        }
      });
    }

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