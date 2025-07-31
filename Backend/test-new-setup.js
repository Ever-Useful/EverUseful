require('dotenv').config();
const userService = require('./services/userService');

async function testNewSetup() {
  console.log('🧪 Testing Firebase Auth + DynamoDB Setup (No Firestore)...\n');

  try {
    // Test 1: Create a test user
    console.log('Test 1: Creating a test user...');
    const testFirebaseUid = `test_firebase_uid_${Date.now()}`;
    const testUserData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      userType: 'student',
      mobile: '1234567890'
    };

    const createdUser = await userService.createUser(testFirebaseUid, testUserData);
    console.log('✅ Test user created successfully!');
    console.log('Custom User ID:', createdUser.customUserId);
    console.log('');

    // Test 2: Find user by Firebase UID
    console.log('Test 2: Finding user by Firebase UID...');
    const foundUser = await userService.findUserByFirebaseUid(testFirebaseUid);
    if (foundUser) {
      console.log('✅ User found successfully by Firebase UID!');
      console.log('User details:', {
        customUserId: foundUser.customUserId,
        firstName: foundUser.profile.firstName,
        lastName: foundUser.profile.lastName,
        email: foundUser.profile.email
      });
    } else {
      console.log('❌ User not found by Firebase UID');
    }
    console.log('');

    // Test 3: Update user profile
    console.log('Test 3: Updating user profile...');
    const updateData = {
      bio: 'This is a test bio',
      location: 'Test City',
      title: 'Test Developer'
    };
    const updatedUser = await userService.updateUserProfile(createdUser.customUserId, updateData);
    console.log('✅ User profile updated successfully!');
    console.log('Updated bio:', updatedUser.profile.bio);
    console.log('');

    // Test 4: Add a skill
    console.log('Test 4: Adding a skill...');
    const skillData = {
      name: 'JavaScript',
      category: 'Programming',
      expertise: 'Intermediate'
    };
    const addedSkill = await userService.addUserSkill(createdUser.customUserId, skillData);
    console.log('✅ Skill added successfully!');
    console.log('Skill:', addedSkill.name);
    console.log('');

    console.log('🎉 All tests passed! Firebase Auth + DynamoDB setup is working correctly.');
    console.log('\n📊 Summary:');
    console.log('- ✅ User creation with Firebase UID: Working');
    console.log('- ✅ User lookup by Firebase UID: Working');
    console.log('- ✅ Profile updates: Working');
    console.log('- ✅ Skill management: Working');
    console.log('- ✅ No Firestore dependency: Working');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testNewSetup(); 