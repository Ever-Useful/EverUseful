const AWS = require('aws-sdk');

// Load environment variables
require('dotenv').config();

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// Configure AWS
AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB();

const createAgentsTable = async () => {
  try {
    // Create Agents table
    const agentsTableParams = {
      TableName: process.env.DYNAMODB_AGENTS_TABLE || 'Agents',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'category', AttributeType: 'S' },
        { AttributeName: 'author', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' }
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
        },
        {
          IndexName: 'CreatedAtIndex',
          KeySchema: [
            { AttributeName: 'createdAt', KeyType: 'HASH' }
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

    console.log('Creating Agents table...');
    await dynamodb.createTable(agentsTableParams).promise();
    console.log('Agents table created successfully!');

    console.log('All tables created successfully!');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Agents table already exists!');
    } else {
      console.error('Error creating Agents table:', error);
    }
  }
};

// Run the script
createAgentsTable();