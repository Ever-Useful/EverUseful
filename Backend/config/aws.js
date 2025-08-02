const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'everuseful-users',
  MARKETPLACE: process.env.DYNAMODB_MARKETPLACE_TABLE || 'everuseful-marketplace'
};

module.exports = {
  dynamodb,
  TABLES
}; 