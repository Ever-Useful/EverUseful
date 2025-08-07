const AWS = require('aws-sdk');

// Configure AWS with conditional credentials
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1'
};

// Only add access keys if they are provided (for localhost development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('Using AWS access keys for authentication (development mode)');
  awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
} else {
  console.log('Using IAM roles for AWS authentication (production mode)');
  // AWS SDK will automatically use IAM roles when no access keys are provided
}

// Configure AWS
AWS.config.update(awsConfig);

// Initialize DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'Users',
  MARKETPLACE: process.env.DYNAMODB_MARKETPLACE_TABLE || 'MarketplaceProjects'
};

console.log('AWS Configuration:', {
  region: awsConfig.region,
  usersTable: TABLES.USERS,
  marketplaceTable: TABLES.MARKETPLACE,
  usingIAMRoles: !process.env.AWS_ACCESS_KEY_ID
});

module.exports = {
  dynamodb,
  TABLES
}; 