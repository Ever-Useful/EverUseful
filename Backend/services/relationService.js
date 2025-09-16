// services/relationService.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'ap-south-1' });

const TABLE = process.env.DYNAMODB_USER_RELATIONS_TABLE || 'UserRelations';
const MAX_TIMESTAMP = () => Date.now();

class RelationService {
  constructor() {}

  // Ensure the per-user relations item exists (create if missing)
  // async ensureUserItem(userId) {
  //   const params = {
  //     TableName: TABLE,
  //     Key: { userId },
  //     UpdateExpression: `SET #sent = if_not_exists(#sent, :emptyMap), #recv = if_not_exists(#recv, :emptyMap), #blk = if_not_exists(#blk, :emptyMap), #conn = if_not_exists(#conn, :emptyMap), #c = if_not_exists(#c, :counters), updatedAt = if_not_exists(updatedAt, :now)`,
  //     ExpressionAttributeNames: {
  //       '#sent': 'requestsSent',
  //       '#recv': 'requestsReceived',
  //       '#blk': 'blockedUsers',
  //       '#conn': 'connections',
  //       '#c': 'counters'
  //     },
  //     ExpressionAttributeValues: {
  //       ':emptyMap': {},
  //       ':counters': {
  //         totalConnections: 0,
  //         pendingConnections: 0,
  //         requestsSent: 0,
  //         requestsReceived: 0
  //       },
  //       ':now': MAX_TIMESTAMP()
  //     },
  //     ReturnValues: 'NONE'
  //   };

  //   await docClient.update(params).promise();
  // }

  async ensureUserItem(userId) {
  const params = {
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: `
      SET 
        #sent = if_not_exists(#sent, :emptyMap), 
        #recv = if_not_exists(#recv, :emptyMap), 
        #blk = if_not_exists(#blk, :emptyMap), 
        #conn = if_not_exists(#conn, :emptyMap), 
        #c = if_not_exists(#c, :counters), 
        updatedAt = if_not_exists(updatedAt, :now),
        notifications = if_not_exists(notifications, :emptyList),
        unreadCount = if_not_exists(unreadCount, :zero)
    `,
    ExpressionAttributeNames: {
      '#sent': 'requestsSent',
      '#recv': 'requestsReceived',
      '#blk': 'blockedUsers',
      '#conn': 'connections',
      '#c': 'counters'
    },
    ExpressionAttributeValues: {
      ':emptyMap': {},
      ':counters': {
        totalConnections: 0,
        pendingConnections: 0,
        requestsSent: 0,
        requestsReceived: 0
      },
      ':now': MAX_TIMESTAMP(),
      ':emptyList': [],
      ':zero': 0
    },
    ReturnValues: 'NONE'
  };
  await docClient.update(params).promise();
}

  // Coerce structure: ensures attributes are maps (overwrites wrong types)
  async coerceMaps(userId) {
    const now = MAX_TIMESTAMP();

    // Helper to coerce a single attribute to an empty map if it is not a map
    const coerceAttributeToMap = async (attrName) => {
      try {
        // If attribute exists and is a map, this condition passes and no-op update occurs
        await docClient.update({
          TableName: TABLE,
          Key: { userId },
          UpdateExpression: `SET updatedAt = :now`,
          ConditionExpression: `attribute_not_exists(#a) OR attribute_type(#a, :mapType)` ,
          ExpressionAttributeNames: { '#a': attrName },
          ExpressionAttributeValues: { ':now': now, ':mapType': 'M' },
        }).promise();
      } catch (err) {
        // Condition failed: attribute exists but is not a Map → overwrite with empty map
        await docClient.update({
          TableName: TABLE,
          Key: { userId },
          UpdateExpression: `SET #a = :emptyMap, updatedAt = :now`,
          ExpressionAttributeNames: { '#a': attrName },
          ExpressionAttributeValues: { ':emptyMap': {}, ':now': now },
        }).promise();
      }
    };

    await coerceAttributeToMap('requestsSent');
    await coerceAttributeToMap('requestsReceived');
    await coerceAttributeToMap('blockedUsers');
    await coerceAttributeToMap('connections');
  }

  // Helper: get relations doc
  async get(userId) {
    const params = {
      TableName: TABLE,
      Key: { userId }
    };
    const res = await docClient.get(params).promise();
    return res.Item || {
      userId,
      requestsReceived: {}, // map from fromUserId -> { status, updatedAt }
      requestsSent: {},     // map toUserId -> { status, updatedAt }
      blockedUsers: {},     // map blockedUserId -> true
      connections: {},      // map connectedUserId -> true
      counters: {
        totalConnections: 0,
        pendingConnections: 0,
        requestsSent: 0,
        requestsReceived: 0
      },
      updatedAt: MAX_TIMESTAMP()
    };
  }

//   //Helper: add notification logic
//   async addNotification(userId, notification) {
//   // Compose notification object
//   const notif = {
//     id: uuidv4(),
//     ...notification,
//     createdAt: Date.now(),
//     read: false
//   };

//   const params = {
//     TableName: TABLE,
//     Key: { userId },
//     UpdateExpression: 'SET notifications = list_append(if_not_exists(notifications, :emptyList), :notif), unreadCount = if_not_exists(unreadCount, :zero) + :inc, updatedAt = :now',
//     ExpressionAttributeValues: {
//       ':notif': [notif],
//       ':emptyList': [],
//       ':inc': 1,
//       ':zero': 0,
//       ':now': Date.now()
//     }
//   };
//   await docClient.update(params).promise();
//   return notif;
// }



  // === SEND request A -> B ===
  // idempotent: if existing active status blocks send, throw
  async sendRequest(senderId, receiverId) {
    if (senderId === receiverId) throw new Error('Cannot send request to yourself');

    // Ensure items exist
    await Promise.all([this.ensureUserItem(senderId), this.ensureUserItem(receiverId)]);

    // Coerce structure in case legacy items used lists instead of maps
    await Promise.all([this.coerceMaps(senderId), this.coerceMaps(receiverId)]);

    // Read both items to validate preconditions
    const [sender, receiver] = await Promise.all([this.get(senderId), this.get(receiverId)]);

    // Check blocks
    if ((sender.blockedUsers && sender.blockedUsers[receiverId]) || (receiver.blockedUsers && receiver.blockedUsers[senderId])) {
      throw new Error('Cannot send request — blocked or blocking');
    }

    // Already connected?
    if ((sender.connections && sender.connections[receiverId]) || (receiver.connections && receiver.connections[senderId])) {
      throw new Error('Already connected');
    }

    // If there is already a pending/requested/accepted status, handle idempotently
    const existingOut = sender.requestsSent && sender.requestsSent[receiverId];
    const existingIn = receiver.requestsReceived && receiver.requestsReceived[senderId];

    // If already requested and status REQUESTED, no-op
    if (existingOut && existingOut.status === 'REQUESTED') {
      return { success: true, message: 'Request already sent' };
    }

    // If receiver had already sent a request (cross-request), we may decide: auto-accept.
    // We'll follow simple rule: if receiver had PENDING (i.e., they sent to sender), then resolve to ACCEPTED.
    if (existingIn && existingIn.status === 'REQUESTED') {
      // auto-accept path — call acceptRequest(receiverId=sender? careful)
      // But existingIn in receiver.requestsReceived[senderId] means receiver has a received from senderId
      // Cross-case: if receiver had previously sent to sender (existingOut in receiver), handle merge
    }

    const now = MAX_TIMESTAMP();

    // Build two updates in a transaction
    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { userId: senderId },
            UpdateExpression: `SET requestsSent.#to = :sentObj, counters.requestsSent = if_not_exists(counters.requestsSent, :zero) + :inc, updatedAt = :now`,
            ExpressionAttributeNames: { '#to': receiverId },
            ExpressionAttributeValues: {
              ':sentObj': { toUserId: receiverId, status: 'REQUESTED', updatedAt: now },
              ':inc': 1,
              ':zero': 0,
              ':now': now
            }
          }
        },
        {
          Update: {
            TableName: TABLE,
            Key: { userId: receiverId },
            UpdateExpression: `SET requestsReceived.#from = :recvObj, counters.requestsReceived = if_not_exists(counters.requestsReceived, :zero) + :inc, counters.pendingConnections = if_not_exists(counters.pendingConnections, :zero) + :inc, updatedAt = :now`,
            ExpressionAttributeNames: { '#from': senderId },
            ExpressionAttributeValues: {
              ':recvObj': { fromUserId: senderId, status: 'PENDING', updatedAt: now },
              ':inc': 1,
              ':zero': 0,
              ':now': now
            }
          }
        }
      ]
    };

    await docClient.transactWrite(transactParams).promise();
    return { success: true, message: 'Sent' };
  }

  // === ACCEPT request (B accepts A) ===
  async acceptRequest(receiverId, senderId) {
    if (receiverId === senderId) throw new Error('Invalid operation');

    await Promise.all([this.ensureUserItem(receiverId), this.ensureUserItem(senderId)]);
    const [receiver, sender] = await Promise.all([this.get(receiverId), this.get(senderId)]);

    const incoming = receiver.requestsReceived && receiver.requestsReceived[senderId];
    if (!incoming || incoming.status !== 'PENDING') {
      throw new Error('No pending request to accept');
    }

    const now = MAX_TIMESTAMP();

    // Build transaction: set both statuses to ACCEPTED, add to connections on both sides, update counters
    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { userId: senderId },
            UpdateExpression: `SET requestsSent.#to = :sentObj, connections.#conn = :true, counters.totalConnections = if_not_exists(counters.totalConnections, :zero) + :inc, counters.requestsSent = if_not_exists(counters.requestsSent, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#to': receiverId, '#conn': receiverId },
            ExpressionAttributeValues: {
              ':sentObj': { toUserId: receiverId, status: 'ACCEPTED', updatedAt: now },
              ':true': true,
              ':inc': 1,
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        },
        {
          Update: {
            TableName: TABLE,
            Key: { userId: receiverId },
            UpdateExpression: `SET requestsReceived.#from = :recvObj, connections.#conn = :true, counters.totalConnections = if_not_exists(counters.totalConnections, :zero) + :inc, counters.requestsReceived = if_not_exists(counters.requestsReceived, :zero) - :dec, counters.pendingConnections = if_not_exists(counters.pendingConnections, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#from': senderId, '#conn': senderId },
            ExpressionAttributeValues: {
              ':recvObj': { fromUserId: senderId, status: 'ACCEPTED', updatedAt: now },
              ':true': true,
              ':inc': 1,
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        }
      ]
    };

    await docClient.transactWrite(transactParams).promise();
    return { success: true, message: 'Accepted' };
  }

  // === DECLINE request (B declines A) ===
  async declineRequest(receiverId, senderId) {
    if (receiverId === senderId) throw new Error('Invalid operation');

    const now = MAX_TIMESTAMP();
    await Promise.all([this.ensureUserItem(receiverId), this.ensureUserItem(senderId)]);

    // Ensure there's a pending request
    const receiver = await this.get(receiverId);
    const incoming = receiver.requestsReceived && receiver.requestsReceived[senderId];
    if (!incoming || incoming.status !== 'PENDING') {
      throw new Error('No pending request to decline');
    }

    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { userId: senderId },
            UpdateExpression: `SET requestsSent.#to = :sentObj, counters.requestsSent = if_not_exists(counters.requestsSent, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#to': receiverId },
            ExpressionAttributeValues: {
              ':sentObj': { toUserId: receiverId, status: 'CANCELLED', updatedAt: now },
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        },
        {
          Update: {
            TableName: TABLE,
            Key: { userId: receiverId },
            UpdateExpression: `SET requestsReceived.#from = :recvObj, counters.requestsReceived = if_not_exists(counters.requestsReceived, :zero) - :dec, counters.pendingConnections = if_not_exists(counters.pendingConnections, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#from': senderId },
            ExpressionAttributeValues: {
              ':recvObj': { fromUserId: senderId, status: 'DECLINED', updatedAt: now },
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        }
      ]
    };

    await docClient.transactWrite(transactParams).promise();
    return { success: true, message: 'Declined' };
  }

  // === CANCEL/WITHDRAW by sender ===
  async cancelRequest(senderId, receiverId) {
    if (senderId === receiverId) throw new Error('Invalid operation');

    await Promise.all([this.ensureUserItem(senderId), this.ensureUserItem(receiverId)]);
    
    // Check preconditions
    const sender = await this.get(senderId);
    const receiver = await this.get(receiverId);
    
    const existingSent = sender.requestsSent && sender.requestsSent[receiverId];
    const existingReceived = receiver.requestsReceived && receiver.requestsReceived[senderId];
    
    if (!existingSent || existingSent.status !== 'REQUESTED') {
      throw new Error('No active request to withdraw');
    }
    
    if (!existingReceived || existingReceived.status !== 'PENDING') {
      throw new Error('No pending request to withdraw');
    }

    const now = MAX_TIMESTAMP();

    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { userId: senderId },
            UpdateExpression: `SET requestsSent.#to = :sentObj, counters.requestsSent = if_not_exists(counters.requestsSent, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#to': receiverId },
            ExpressionAttributeValues: {
              ':sentObj': { toUserId: receiverId, status: 'WITHDRAWN', updatedAt: now },
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        },
        {
          Update: {
            TableName: TABLE,
            Key: { userId: receiverId },
            UpdateExpression: `REMOVE requestsReceived.#from SET counters.requestsReceived = if_not_exists(counters.requestsReceived, :zero) - :dec, counters.pendingConnections = if_not_exists(counters.pendingConnections, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#from': senderId },
            ExpressionAttributeValues: {
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        }
      ]
    };

    await docClient.transactWrite(transactParams).promise();
    return { success: true, message: 'Withdrawn' };
  }

  // === REMOVE connection (either side) ===
  async removeConnection(actorId, otherId) {
    if (actorId === otherId) throw new Error('Invalid operation');

    await Promise.all([this.ensureUserItem(actorId), this.ensureUserItem(otherId)]);
    const now = MAX_TIMESTAMP();

    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: TABLE,
            Key: { userId: actorId },
            UpdateExpression: `REMOVE connections.#other SET counters.totalConnections = if_not_exists(counters.totalConnections, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#other': otherId },
            ExpressionAttributeValues: {
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        },
        {
          Update: {
            TableName: TABLE,
            Key: { userId: otherId },
            UpdateExpression: `REMOVE connections.#actor SET counters.totalConnections = if_not_exists(counters.totalConnections, :zero) - :dec, updatedAt = :now`,
            ExpressionAttributeNames: { '#actor': actorId },
            ExpressionAttributeValues: {
              ':dec': 1,
              ':zero': 0,
              ':now': now
            }
          }
        }
      ]
    };

    await docClient.transactWrite(transactParams).promise();
    return { success: true, message: 'Removed' };
  }

  // === BLOCK user ===
  async blockUser(actorId, blockedId) {
    if (actorId === blockedId) throw new Error('Invalid operation');

    await Promise.all([this.ensureUserItem(actorId), this.ensureUserItem(blockedId)]);
    const now = MAX_TIMESTAMP();

    // Clean up any pending requests and remove connection
    // We'll set blockedUsers[blockedId] = true and remove mutual connections/requests
    const transactItems = [];

    // Add to blockedUsers for actor
    transactItems.push({
      Update: {
        TableName: TABLE,
        Key: { userId: actorId },
        UpdateExpression: `SET blockedUsers.#b = :true, updatedAt = :now REMOVE connections.#b, requestsSent.#b, requestsReceived.#b`,
        ExpressionAttributeNames: { '#b': blockedId },
        ExpressionAttributeValues: {
          ':true': true,
          ':now': now
        }
      }
    });

    // Also remove actor from blockedId's connections/requests (cleanup optional)
    transactItems.push({
      Update: {
        TableName: TABLE,
        Key: { userId: blockedId },
        UpdateExpression: `REMOVE connections.#a, requestsSent.#a, requestsReceived.#a SET updatedAt = :now`,
        ExpressionAttributeNames: { '#a': actorId },
        ExpressionAttributeValues: {
          ':now': now
        }
      }
    });

    await docClient.transactWrite({ TransactItems: transactItems }).promise();
    return { success: true, message: 'Blocked' };
  }

  // === UNBLOCK user ===
  async unblockUser(actorId, blockedId) {
    await this.ensureUserItem(actorId);
    const now = MAX_TIMESTAMP();

    const params = {
      TableName: TABLE,
      Key: { userId: actorId },
      UpdateExpression: `REMOVE blockedUsers.#b SET updatedAt = :now`,
      ExpressionAttributeNames: { '#b': blockedId },
      ExpressionAttributeValues: { ':now': now },
      ReturnValues: 'ALL_NEW'
    };

    const res = await docClient.update(params).promise();
    return { success: true, item: res.Attributes };
  }

  // === Get my relations document ===
  async getMyRelations(userId) {
    return await this.get(userId);
  }

  // === Relationship status between A (viewer) and B (other) ===
  // returns CONNECTED | PENDING_OUT | PENDING_IN | BLOCKED | NONE
  async getStatus(viewerId, otherId) {
    const [viewer, other] = await Promise.all([this.get(viewerId), this.get(otherId)]);

    if ((viewer.blockedUsers && viewer.blockedUsers[otherId]) || (other.blockedUsers && other.blockedUsers[viewerId])) {
      return { relation: 'BLOCKED' };
    }

    if (viewer.connections && viewer.connections[otherId]) return { relation: 'CONNECTED' };

    if (viewer.requestsSent && viewer.requestsSent[otherId] && viewer.requestsSent[otherId].status === 'REQUESTED') {
      return { relation: 'PENDING_OUT' };
    }

    if (viewer.requestsReceived && viewer.requestsReceived[otherId] && viewer.requestsReceived[otherId].status === 'PENDING') {
      return { relation: 'PENDING_IN' };
    }

    return { relation: 'NONE' };
  }

  async addNotification(userId, notification) {
  // Compose notification object
  const notif = {
    id: uuidv4(),
    ...notification,
    createdAt: Date.now(),
    read: false
  };

  const params = {
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: 'SET notifications = list_append(if_not_exists(notifications, :emptyList), :notif), unreadCount = if_not_exists(unreadCount, :zero) + :inc, updatedAt = :now',
    ExpressionAttributeValues: {
      ':notif': [notif],
      ':emptyList': [],
      ':inc': 1,
      ':zero': 0,
      ':now': Date.now()
    }
  };
  await docClient.update(params).promise();
  return notif;
}

async markNotificationRead(userId, notificationId) {
  // Fetch user
  const user = await this.get(userId);
  const notifications = user.notifications || [];
  const updated = notifications.map(n => {
    if (n.id === notificationId) return { ...n, read: true };
    return n;
  });
  const unreadCount = Math.max(0, (user.unreadCount || 0) - 1);

  const params = {
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: 'SET notifications = :updated, unreadCount = :count, updatedAt = :now',
    ExpressionAttributeValues: {
      ':updated': updated,
      ':count': unreadCount,
      ':now': Date.now()
    }
  };
  await docClient.update(params).promise();
}

async clearNotifications(userId) {
  const params = {
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: 'SET notifications = :emptyList, unreadCount = :zero, updatedAt = :now',
    ExpressionAttributeValues: {
      ':emptyList': [],
      ':zero': 0,
      ':now': Date.now()
    }
  };
  await docClient.update(params).promise();
}
}

module.exports = new RelationService();
