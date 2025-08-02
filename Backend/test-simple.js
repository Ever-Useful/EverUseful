require('dotenv').config();
const userService = require('./services/userService');

async function testSimple() {
  console.log('🧪 Simple DynamoDB Test...\n');

  try {
    // Test 1: Create a simple user
    console.log('Test 1: Creating a simple user...');
    const testFirebaseUid = `test_${Date.now()}`;
    const testUserData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      userType: 'student'
    };

    const createdUser = await userService.createUser(testFirebaseUid, testUserData);
    console.log('✅ User created successfully!');
    console.log('Custom User ID:', createdUser.customUserId);
    console.log('');

    // Test 2: Find the user
    console.log('Test 2: Finding the user...');
    const foundUser = await userService.findUserByFirebaseUid(testFirebaseUid);
    if (foundUser) {
      console.log('✅ User found successfully!');
      console.log('User details:', {
        customUserId: foundUser.customUserId,
        firstName: foundUser.profile.firstName,
        lastName: foundUser.profile.lastName,
        email: foundUser.profile.email
      });
    } else {
      console.log('❌ User not found');
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testSimple(); 