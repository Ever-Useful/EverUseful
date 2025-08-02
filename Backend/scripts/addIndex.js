require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB();

async function addFirebaseUidIndex() {
  console.log('🔧 Adding FirebaseUidIndex to Users table...\n');

  try {
    const params = {
      TableName: 'Users',
      AttributeDefinitions: [
        {
          AttributeName: 'firebaseUid',
          AttributeType: 'S'
        }
      ],
      GlobalSecondaryIndexUpdates: [
        {
          Create: {
            IndexName: 'FirebaseUidIndex',
            KeySchema: [
              {
                AttributeName: 'firebaseUid',
                KeyType: 'HASH'
              }
            ],
            Projection: {
              ProjectionType: 'ALL'
            },
            // No ProvisionedThroughput for PAY_PER_REQUEST billing mode
          }
        }
      ]
    };

    await dynamodb.updateTable(params).promise();
    console.log('✅ FirebaseUidIndex created successfully!');
    console.log('📊 Index details:');
    console.log('   - Index Name: FirebaseUidIndex');
    console.log('   - Key Attribute: firebaseUid');
    console.log('   - Projection Type: ALL');
    console.log('   - Billing Mode: PAY_PER_REQUEST (on-demand)');

  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('ℹ️  Index already exists or is being created...');
    } else if (error.code === 'ValidationException' && error.message.includes('already exists')) {
      console.log('ℹ️  Index already exists...');
    } else {
      console.error('❌ Error creating index:', error.message);
      console.error('Full error:', error);
    }
  }
}

// Run the script
addFirebaseUidIndex(); 