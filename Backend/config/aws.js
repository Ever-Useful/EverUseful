const AWS = require('aws-sdk');

// Configure AWS with conditional credentials
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1'
};

// Check if access keys are provided and use them
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

// Initialize S3 (without acceleration for now)
const s3 = new AWS.S3({
  useAccelerateEndpoint: false,
  region: awsConfig.region
});

// Initialize DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'Users',
  MARKETPLACE: process.env.DYNAMODB_MARKETPLACE_TABLE || 'MarketplaceProjects'
};

// S3 Configuration
const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'amogh-assets',
  REGION: awsConfig.region,
  ACCELERATION_ENABLED: true
};

console.log('AWS Configuration:', {
  region: awsConfig.region,
  usersTable: TABLES.USERS,
  marketplaceTable: TABLES.MARKETPLACE,
  s3Bucket: S3_CONFIG.BUCKET_NAME,
  usingIAMRoles: !process.env.AWS_ACCESS_KEY_ID,
  accessKeySet: !!process.env.AWS_ACCESS_KEY_ID,
  secretKeySet: !!process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = {
  dynamodb,
  s3,
  TABLES,
  S3_CONFIG
}; 