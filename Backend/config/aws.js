const AWS = require('aws-sdk');

// Configure AWS with conditional credentials
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1'
};

// Only add access keys if they are provided (for localhost development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

// Configure AWS
AWS.config.update(awsConfig);

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