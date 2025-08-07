require('dotenv').config({ path: './.env' });
const AWS = require('aws-sdk');

// Configure AWS with conditional credentials
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1'
};

// Only add access keys if they are provided (for localhost development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB();

const createTables = async () => {
  try {
    // Create Users table
    const usersTableParams = {
      TableName: process.env.DYNAMODB_USERS_TABLE || 'Users',
      KeySchema: [
        { AttributeName: 'customUserId', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'customUserId', AttributeType: 'S' },
        { AttributeName: 'firebaseUid', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'FirebaseUidIndex',
          KeySchema: [
            { AttributeName: 'firebaseUid', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    // Create Marketplace table
    const marketplaceTableParams = {
      TableName: process.env.DYNAMODB_MARKETPLACE_TABLE || 'MarketplaceProjects',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'category', AttributeType: 'S' },
        { AttributeName: 'author', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'CategoryIndex',
          KeySchema: [
            { AttributeName: 'category', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        },
        {
          IndexName: 'AuthorIndex',
          KeySchema: [
            { AttributeName: 'author', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    console.log('Creating Users table...');
    await dynamodb.createTable(usersTableParams).promise();
    console.log('Users table created successfully!');

    console.log('Creating Marketplace table...');
    await dynamodb.createTable(marketplaceTableParams).promise();
    console.log('Marketplace table created successfully!');

    console.log('All tables created successfully!');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Tables already exist!');
    } else {
      console.error('Error creating tables:', error);
    }
  }
};

// Run the script
createTables(); 