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

    // Create UserRelations table
    const userRelationsParams = {
      TableName: process.env.DYNAMODB_USER_RELATIONS_TABLE || 'UserRelations',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    };

    console.log('Creating UserRelations table...');
    try {
      await dynamodb.createTable(userRelationsParams).promise();
      console.log('UserRelations table created successfully!');
    } catch (err) {
      if (err.code === 'ResourceInUseException') {
        console.log('UserRelations table already exists');
      } else {
        console.error('Error creating UserRelations table:', err);
      }
    }


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