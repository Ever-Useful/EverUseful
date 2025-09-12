// routes/relations.js
const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const relationService = require('../services/relationService');
const userService = require('../services/userService'); // to resolve firebase uid -> customUserId

// POST /relations/send { toUserId }
router.post('/send', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ success: false, message: 'toUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.sendRequest(me.customUserId, toUserId);

    // real-time notify
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(toUserId).emit('relation_request_received', { from: me.customUserId });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/send', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/accept { fromUserId }
router.post('/accept', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { fromUserId } = req.body;
    if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.acceptRequest(me.customUserId, fromUserId);

    // notify both
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(fromUserId).emit('relation_update', { type: 'ACCEPTED', between: [me.customUserId, fromUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/accept', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/decline { fromUserId }
router.post('/decline', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { fromUserId } = req.body;
    if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.declineRequest(me.customUserId, fromUserId);

    // realtime update both parties
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(fromUserId).emit('relation_update', { type: 'DECLINED', between: [me.customUserId, fromUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/decline', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/cancel { toUserId }
router.post('/cancel', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ success: false, message: 'toUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.cancelRequest(me.customUserId, toUserId);

    // realtime update both parties
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(toUserId).emit('relation_update', { type: 'CANCELLED', between: [me.customUserId, toUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/cancel', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/remove-connection { otherUserId }
router.post('/remove-connection', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { otherUserId } = req.body;
    if (!otherUserId) return res.status(400).json({ success: false, message: 'otherUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.removeConnection(me.customUserId, otherUserId);

    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(otherUserId).emit('relation_update', { type: 'REMOVED', between: [me.customUserId, otherUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/remove-connection', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/block { blockedUserId }
router.post('/block', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { blockedUserId } = req.body;
    if (!blockedUserId) return res.status(400).json({ success: false, message: 'blockedUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.blockUser(me.customUserId, blockedUserId);

    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(blockedUserId).emit('relation_update', { type: 'BLOCKED', between: [me.customUserId, blockedUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/block', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /relations/unblock { blockedUserId }
router.post('/unblock', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { blockedUserId } = req.body;
    if (!blockedUserId) return res.status(400).json({ success: false, message: 'blockedUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.unblockUser(me.customUserId, blockedUserId);

    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(blockedUserId).emit('relation_update', { type: 'UNBLOCKED', between: [me.customUserId, blockedUserId] });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/unblock', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /relations/me
router.get('/me', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const data = await relationService.getMyRelations(me.customUserId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error /relations/me', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /relations/status?otherUserId=X
router.get('/status', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const otherUserId = req.query.otherUserId;
    if (!otherUserId) return res.status(400).json({ success: false, message: 'otherUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const status = await relationService.getStatus(me.customUserId, otherUserId);
    res.json({ success: true, data: status });
  } catch (err) {
    console.error('Error /relations/status', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
