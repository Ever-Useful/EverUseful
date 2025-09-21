// routes/relations.js
const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const relationService = require('../services/relationService');
const userService = require('../services/userService'); // to resolve firebase uid -> customUserId
const { v4: uuidv4 } = require('uuid');

// Add notification to UserRelations table
async function addUserRelationNotification(userId, notification) {
  // Compose notification object (minimal, add more fields if needed)
  const notif = {
    id: uuidv4(),
    ...notification,
    createdAt: Date.now(),
    read: false
  };
  // Add notification & increment unreadCount atomically
  const AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'ap-south-1' });
  const TABLE = process.env.DYNAMODB_USER_RELATIONS_TABLE || 'UserRelations';
  await docClient.update({
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: 'SET notifications = list_append(if_not_exists(notifications, :emptyList), :notif), unreadCount = if_not_exists(unreadCount, :zero) + :inc',
    ExpressionAttributeValues: {
      ':notif': [notif],
      ':emptyList': [],
      ':inc': 1,
      ':zero': 0
    }
  }).promise();
  return notif;
}

// Mark notification as read
async function markUserRelationNotificationRead(userId, notificationId) {
  const AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'ap-south-1' });
  const TABLE = process.env.DYNAMODB_USER_RELATIONS_TABLE || 'UserRelations';
  // Fetch full notifications
  const data = await docClient.get({ TableName: TABLE, Key: { userId } }).promise();
  const notifications = (data.Item && data.Item.notifications) ? data.Item.notifications : [];
  let updatedCount = (data.Item && data.Item.unreadCount) ? data.Item.unreadCount : 0;
  const updatedNotifications = notifications.map(n => {
    if (n.id === notificationId && !n.read) {
      updatedCount = Math.max(0, updatedCount - 1);
      return { ...n, read: true };
    }
    return n;
  });
  await docClient.update({
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: 'SET notifications = :notifs, unreadCount = :count',
    ExpressionAttributeValues: {
      ':notifs': updatedNotifications,
      ':count': updatedCount
    }
  }).promise();
}
router.post('/send', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ success: false, message: 'toUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.sendRequest(me.customUserId, toUserId);

    // real-time notify receiver
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(toUserId).emit('relation_request_received', {
        from: me.customUserId,
        firstName: me.firstName || "",
        lastName: me.lastName || ""
      });
    }

    // --- ADD Notification: Receiver ---
    const notifReceiver = {
      type: 'SEND',
      title: 'Connection Request Received',
      message: `${me.firstName || ""} ${me.lastName || ""} sent you a connection request`,
      meta: { from: me.customUserId }
    };
    await addUserRelationNotification(toUserId, notifReceiver);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(toUserId).emit('user_notification', notifReceiver);
    }

    // --- ADD Notification: Sender ---
    // Get receiver's name
    const receiverUser = await userService.findUserByCustomId(toUserId);
    const receiverName = receiverUser
      ? `${receiverUser.firstName || receiverUser.profile?.firstName || ""} ${receiverUser.lastName || receiverUser.profile?.lastName || ""}`.trim()
      : "User";
    const notifSender = {
      type: 'SEND',
      title: 'Connection Request Sent',
      message: `You sent a connection request to ${receiverName}`,
      meta: { to: toUserId }
    };
    await addUserRelationNotification(me.customUserId, notifSender);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('user_notification', notifSender);
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/send', err);
    res.status(400).json({ success: false, message: err.message });
  }
});
// // POST /relations/accept { fromUserId }
// router.post('/accept', authorize, async (req, res) => {
//   try {
//     const firebaseUid = req.user.uid;
//     const { fromUserId } = req.body;
//     if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

//     const me = await userService.findUserByFirebaseUid(firebaseUid);
//     if (!me) return res.status(404).json({ success: false, message: 'User not found' });

//     const result = await relationService.acceptRequest(me.customUserId, fromUserId);

//     // notify both
// if (req.app && req.app.get('io')) {
//   // Fetch both user records (me = receiver, other = sender)
//   const meUser = me; // already fetched
//   const otherUser = await userService.findUserByCustomUserId(fromUserId);

//   req.app.get('io').to(me.customUserId).emit('relation_update', {
//     type: 'ACCEPTED',
//     between: [me.customUserId, fromUserId],
//     senderFirstName: otherUser?.firstName || '',
//     senderLastName: otherUser?.lastName || '',
//     receiverFirstName: meUser?.firstName || '',
//     receiverLastName: meUser?.lastName || ''
//   });
//   req.app.get('io').to(fromUserId).emit('relation_update', {
//     type: 'ACCEPTED',
//     between: [me.customUserId, fromUserId],
//     senderFirstName: otherUser?.firstName || '',
//     senderLastName: otherUser?.lastName || '',
//     receiverFirstName: meUser?.firstName || '',
//     receiverLastName: meUser?.lastName || ''
//   });
// }

//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error('Error /relations/accept', err);
//     res.status(400).json({ success: false, message: err.message });
//   }

//     const notif = {
//     type: 'CONNECTION_ACCEPTED',
//     message: `${me.firstName || ""} ${me.lastName || ""} accepted your connection request`,
//     meta: { to: me.customUserId }
//   };
//   await addUserRelationNotification(fromUserId, notif);
//   if (req.app && req.app.get('io')) {
//     req.app.get('io').to(fromUserId).emit('user_notification', notif);
//   }
//   res.json({ success: true, data: result });
// });


// POST /relations/accept { fromUserId }
router.post('/accept', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { fromUserId } = req.body;
    if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.acceptRequest(me.customUserId, fromUserId);

    if (req.app && req.app.get('io')) {
      const meUser = me;
      const otherUser = await userService.findUserByCustomId(fromUserId);
      // Emit relation_update to both (for real-time UI update)
      req.app.get('io').to(me.customUserId).emit('relation_update', {
        type: 'ACCEPTED',
        between: [me.customUserId, fromUserId],
        senderFirstName: otherUser?.firstName || '',
        senderLastName: otherUser?.lastName || '',
        receiverFirstName: meUser?.firstName || '',
        receiverLastName: meUser?.lastName || ''
      });
      req.app.get('io').to(fromUserId).emit('relation_update', {
        type: 'ACCEPTED',
        between: [me.customUserId, fromUserId],
        senderFirstName: otherUser?.firstName || '',
        senderLastName: otherUser?.lastName || '',
        receiverFirstName: meUser?.firstName || '',
        receiverLastName: meUser?.lastName || ''
      });
    }

    // --- ADD Notification for sender (fromUserId) ---
    const notif = {
      type: 'ACCEPT',
      title: 'Connection Accepted',
      message: `${me.firstName || ""} ${me.lastName || ""} accepted your connection request`,
      meta: { to: me.customUserId }
    };
    await addUserRelationNotification(fromUserId, notif);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(fromUserId).emit('user_notification', notif);
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/accept', err);
    res.status(400).json({ success: false, message: err.message });
  }
});



// POST /relations/decline { fromUserId }
// router.post('/decline', authorize, async (req, res) => {
//   try {
//     const firebaseUid = req.user.uid;
//     const { fromUserId } = req.body;
//     if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

//     const me = await userService.findUserByFirebaseUid(firebaseUid); // User B (decliner)
//     if (!me) return res.status(404).json({ success: false, message: 'User not found' });

//     const result = await relationService.declineRequest(me.customUserId, fromUserId);

//     // Notify sender (User A) of decline
//     if (req.app && req.app.get('io')) {
//       const senderUser = await userService.findUserByCustomUserId(fromUserId); // User A (sender)
//       req.app.get('io').to(fromUserId).emit('relation_update', {
//         type: 'DECLINED',
//         between: [me.customUserId, fromUserId],
//         declinerFirstName: me.firstName || "",
//         declinerLastName: me.lastName || "",
//         senderFirstName: senderUser?.firstName || "",
//         senderLastName: senderUser?.lastName || ""
//       });
//     }

//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error('Error /relations/decline', err);
//     res.status(400).json({ success: false, message: err.message });
//   }
//   router.post('/decline', authorize, async (req, res) => {
//   // ... existing code ...
//   const notif = {
//     type: 'CONNECTION_DECLINED',
//     message: `${me.firstName || ""} ${me.lastName || ""} declined your connection request`,
//     meta: { to: me.customUserId }
//   };
//   await addUserRelationNotification(fromUserId, notif);
//   if (req.app && req.app.get('io')) {
//     req.app.get('io').to(fromUserId).emit('user_notification', notif);
//   }
//   res.json({ success: true, data: result });
// })
// });
// POST /relations/decline { fromUserId }
router.post('/decline', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { fromUserId } = req.body;
    if (!fromUserId) return res.status(400).json({ success: false, message: 'fromUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid); // User B (decliner)
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.declineRequest(me.customUserId, fromUserId);

    // Notify sender (User A) of decline (for UI update only, not notification)
    if (req.app && req.app.get('io')) {
      const senderUser = await userService.findUserByCustomId(fromUserId); // User A (sender)
      req.app.get('io').to(fromUserId).emit('relation_update', {
        type: 'DECLINED',
        between: [me.customUserId, fromUserId],
        declinerFirstName: me.firstName || "",
        declinerLastName: me.lastName || "",
        senderFirstName: senderUser?.firstName || "",
        senderLastName: senderUser?.lastName || ""
      });
    }

    // --- ADD Notification for receiver only ---
    const notif = {
      type: 'DECLINE',
      title: 'You declined a connection request',
      message: `You declined the connection request from ${senderUser?.firstName || ""} ${senderUser?.lastName || ""}`,
      meta: { from: fromUserId }
    };
    await addUserRelationNotification(me.customUserId, notif);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('user_notification', notif);
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error /relations/decline', err);
    res.status(400).json({ success: false, message: err.message });
  }
});
// POST /relations/cancel { toUserId }
// router.post('/cancel', authorize, async (req, res) => {
//   try {
//     const firebaseUid = req.user.uid;
//     const { toUserId } = req.body;
//     if (!toUserId) return res.status(400).json({ success: false, message: 'toUserId required' });

//     const me = await userService.findUserByFirebaseUid(firebaseUid);
//     if (!me) return res.status(404).json({ success: false, message: 'User not found' });

//     const result = await relationService.cancelRequest(me.customUserId, toUserId);

//     // realtime update both parties
//     if (req.app && req.app.get('io')) {
//       req.app.get('io').to(me.customUserId).to(toUserId).emit('relation_update', { type: 'WITHDRAWN', between: [me.customUserId, toUserId] });
//     }

//     res.json({ success: true, data: result });
//   } catch (err) {
//     console.error('Error /relations/cancel', err);
//     res.status(400).json({ success: false, message: err.message });
//   }
// });


// POST /relations/cancel { toUserId }
router.post('/cancel', authorize, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ success: false, message: 'toUserId required' });

    const me = await userService.findUserByFirebaseUid(firebaseUid);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await relationService.cancelRequest(me.customUserId, toUserId);

    // realtime update both parties (for UI state, not notification)
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).to(toUserId).emit('relation_update', { type: 'WITHDRAWN', between: [me.customUserId, toUserId] });
    }

    // --- ADD Notification for the request withdrawer (sender) only ---
// Fetch receiver's details
const receiverUser = await userService.findUserByCustomId(toUserId);
const receiverName = receiverUser
  ? `${receiverUser.firstName || receiverUser.profile?.firstName || ""} ${receiverUser.lastName || receiverUser.profile?.lastName || ""}`.trim()
  : "User";

// --- ADD Notification for the request withdrawer (sender) only ---
const notif = {
  type: 'WITHDRAW',
  title: 'You withdrew a connection request',
  message: `You withdrew your connection request to ${receiverName}`,
  meta: { to: toUserId }
};
// await addUserRelationNotification(me.customUserId, notif);
// if (req.app && req.app.get('io')) {
//   req.app.get('io').to(me.customUserId).emit('user_notification', notif);
// }
    await addUserRelationNotification(me.customUserId, notif);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('user_notification', notif);
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
    const me = await userService.findUserByFirebaseUid(firebaseUid); // User A (blocker)
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch blocked user's name!
    const blockedUser = await userService.findUserByCustomId(blockedUserId);
    const result = await relationService.blockUser(me.customUserId, blockedUserId);

    // --- ADD Notification ---
    const notif = {
      type: 'BLOCK_CONFIRM',
      message: `You have blocked ${blockedUser?.profile?.firstName || ""} ${blockedUser?.profile?.lastName || ""}`,
      meta: { blockedUserId }
    };
    await addUserRelationNotification(me.customUserId, notif);

    // --- SOCKET EMITS ---
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('relation_update', {
        type: 'BLOCKED',
        blockerFirstName: me.firstName || "",
        blockerLastName: me.lastName || "",
        blockedUserId,
        blockedFirstName: blockedUser?.profile?.firstName || "",
        blockedLastName: blockedUser?.profile?.lastName || ""
      });
      req.app.get('io').to(me.customUserId).emit('user_notification', notif);
    }

    // --- SINGLE Response ---
    res.json({ success: true, data: result });
  } catch (err){
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

    const me = await userService.findUserByFirebaseUid(firebaseUid); // User A (unblocker)
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    // FIX: Fetch blocked user's name!
    const blockedUser = await userService.findUserByCustomId(blockedUserId);

    const result = await relationService.unblockUser(me.customUserId, blockedUserId);

    // ADD notification and emit socket event BEFORE responding!
    const notif = {
      type: 'UNBLOCK_CONFIRM',
      message: `You have unblocked ${blockedUser?.profile?.firstName || ""} ${blockedUser?.profile?.lastName || ""}`,
      meta: { blockedUserId }
    };
    await addUserRelationNotification(me.customUserId, notif);
    if (req.app && req.app.get('io')) {
      req.app.get('io').to(me.customUserId).emit('relation_update', {
        type: 'UNBLOCKED',
        unblockerFirstName: me.firstName || "",
        unblockerLastName: me.lastName || "",
        blockedUserId,
        blockedFirstName: blockedUser?.profile?.firstName || "",
        blockedLastName: blockedUser?.profile?.lastName || ""
      });
      req.app.get('io').to(me.customUserId).emit('user_notification', notif);
    }

    // Respond ONCE
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

// GET /relations/notifications
router.get('/notifications', authorize, async (req, res) => {
  const firebaseUid = req.user.uid;
  const me = await userService.findUserByFirebaseUid(firebaseUid);
  if (!me) return res.status(404).json({ success: false, message: 'User not found' });
  const AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'ap-south-1' });
  const TABLE = process.env.DYNAMODB_USER_RELATIONS_TABLE || 'UserRelations';
  const data = await docClient.get({ TableName: TABLE, Key: { userId: me.customUserId } }).promise();
  res.json({
    success: true,
    notifications: data.Item ? data.Item.notifications || [] : [],
    unreadCount: data.Item ? data.Item.unreadCount || 0 : 0
  });
});

// POST /relations/notifications/:notificationId/read
router.post('/notifications/:notificationId/read', authorize, async (req, res) => {
  const firebaseUid = req.user.uid;
  const me = await userService.findUserByFirebaseUid(firebaseUid);
  if (!me) return res.status(404).json({ success: false, message: 'User not found' });
  await markUserRelationNotificationRead(me.customUserId, req.params.notificationId);
  res.json({ success: true });
});

// POST /relations/notifications/clear
router.post('/notifications/clear', authorize, async (req, res) => {
  const firebaseUid = req.user.uid;
  const me = await userService.findUserByFirebaseUid(firebaseUid);
  if (!me) return res.status(404).json({ success: false, message: 'User not found' });
  await relationService.clearNotifications(me.customUserId);
  res.json({ success: true });
});

module.exports = router;
