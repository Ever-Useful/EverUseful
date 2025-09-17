const { dynamodb, TABLES } = require('../config/aws');

class NotificationService {
  async listByUser(userId, limit = 200) {
    const params = {
      TableName: TABLES.NOTIFICATIONS,
      IndexName: 'ByUserAndCreatedAt',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
      ScanIndexForward: false,
      Limit: limit,
    };
    const res = await dynamodb.query(params).promise();
    return res.Items || [];
  }

  async clearAll(userId) {
    const items = await this.listByUser(userId, 500);
    if (!items.length) return { deleted: 0 };
    // Batch delete in chunks of 25
    let deleted = 0;
    for (let i = 0; i < items.length; i += 25) {
      const chunk = items.slice(i, i + 25);
      const req = {
        RequestItems: {
          [TABLES.NOTIFICATIONS]: chunk.map((n) => ({
            DeleteRequest: { Key: { notificationId: n.notificationId } },
          })),
        },
      };
      await dynamodb.batchWrite(req).promise();
      deleted += chunk.length;
    }
    return { deleted };
  }
}

module.exports = new NotificationService();


