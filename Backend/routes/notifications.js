const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const userService = require('../services/userService');
const notificationService = require('../services/notificationService');

// POST /api/notifications/clear -> delete all notifications for current user
router.post('/clear', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await notificationService.clearAll(me.customUserId);

    // emit socket event so all connected clients clear UI
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('notifications_cleared');
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error('POST /notifications/clear error', err);
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
});

module.exports = router;


