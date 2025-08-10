const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('Current .env file contents:');
  console.log(fs.readFileSync(envPath, 'utf8'));
} else {
  console.log('❌ .env file not found');
  console.log('\n📝 Please create a .env file in the Backend directory with the following content:');
  console.log('\n=== .env file content ===');
  console.log('# AWS Configuration');
  console.log('AWS_ACCESS_KEY_ID=your_access_key_here');
  console.log('AWS_SECRET_ACCESS_KEY=your_secret_key_here');
  console.log('AWS_REGION=ap-south-1');
  console.log('');
  console.log('# S3 Configuration');
  console.log('S3_BUCKET_NAME=amogh-assets');
  console.log('');
  console.log('# DynamoDB Configuration');
  console.log('DYNAMODB_USERS_TABLE=Users');
  console.log('DYNAMODB_MARKETPLACE_TABLE=MarketplaceProjects');
  console.log('=== End .env file content ===');
  console.log('\n🔧 Instructions:');
  console.log('1. Create a new file named ".env" in the Backend directory');
  console.log('2. Copy the content above into the file');
  console.log('3. Replace "your_access_key_here" and "your_secret_key_here" with your actual AWS credentials');
  console.log('4. Save the file');
  console.log('5. Run "node test-s3.js" to test the S3 service');
}

console.log('\n🔍 Current environment variables:');
console.log('- AWS_REGION:', process.env.AWS_REGION || 'Not set');
console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
console.log('- S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || 'Not set'); 