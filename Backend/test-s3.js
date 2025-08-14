// Load environment variables first
require('dotenv').config();

const s3Service = require('./services/s3Service');

async function testS3Service() {
  try {
    console.log('Testing S3 service...');
    console.log('Bucket name:', s3Service.bucketName);
    console.log('Region:', s3Service.region);
    
    // Log AWS configuration
    console.log('AWS Configuration:');
    console.log('- Region:', process.env.AWS_REGION || 'ap-south-1');
    console.log('- Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
    console.log('- Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
    console.log('- S3 Bucket:', process.env.S3_BUCKET_NAME || 'amogh-assets');
    
    // Test creating a user folder
    console.log('\nTesting user folder creation...');
    const result = await s3Service.createUserFolder('TEST_USER_001');
    console.log('User folder creation result:', result);
    
    console.log('\nS3 service test completed successfully!');
  } catch (error) {
    console.error('S3 service test failed:', error);
  }
}

testS3Service(); 