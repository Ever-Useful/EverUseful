const express = require('express');
const cors = require('cors');
const authorize = require('./authorize');
const admin = require('firebase-admin');
const marketplaceRoutes = require('./routes/marketplace');
const userRoutes = require('./routes/users');
const userService = require('./services/userService');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const app = express();

// Initialize Firestore
//this is server
const db = admin.firestore();

app.use(cors({
  origin: '*', // In production, replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Test endpoint to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date().toISOString() });
});

// Marketplace routes
app.use('/api/marketplace', marketplaceRoutes);

// User routes
app.use('/api/users', userRoutes);

app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/token', authorize, async (req, res) => {
  const { uid, name, email, phone_number, firebase } = req.user;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create custom user ID and save to both Firestore and userData.json
      const customUserId = await userService.generateCustomUserId();

      // Parse firstName and lastName from name if available
      let firstName = null;
      let lastName = null;
      if (name) {
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Save to Firestore (minimal fields only)
      await userRef.set({
        customUserId: customUserId,
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        phoneNumber: phone_number ?? '',
        email: email ?? 'no-email@example.com',
        userType: 'student', // Default userType for GET requests
      });

      // Create user in userData.json with all the user data
      await userService.createUser(uid, {
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? 'no-email@example.com',
        userType: 'student',
        mobile: phone_number ?? '',
        phoneNumber: phone_number ?? '',
      });

      console.log("New user created with custom ID:", customUserId);
    } else {
      console.log("Existing user logged in:", email ?? uid);
    }

    return res.json({ redirectUrl: '/profile' });
  } catch (err) {
    console.error("Error saving user:", err.message);
    return res.status(500).json({ error: 'Failed to save user info' });
  }
});

app.post('/token', authorize, async (req, res) => {
  const { uid, name, email, phone_number, firebase } = req.user;
  const { userType, firstName, lastName, phoneNumber } = req.body;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create custom user ID
      const customUserId = await userService.generateCustomUserId();

      // Use provided firstName/lastName or parse from name
      let resolvedFirstName = firstName;
      let resolvedLastName = lastName;
      if ((!firstName || !lastName) && name) {
        const nameParts = name.split(' ');
        resolvedFirstName = resolvedFirstName || nameParts[0] || '';
        resolvedLastName = resolvedLastName || nameParts.slice(1).join(' ') || '';
      }

      // Save to Firestore (minimal fields only)
      await userRef.set({
        customUserId: customUserId,
        firstName: resolvedFirstName ?? '',
        lastName: resolvedLastName ?? '',
        phoneNumber: phoneNumber ?? phone_number ?? '',
        email: email ?? 'no-email@example.com',
        userType: userType ?? 'student',
      });

      // Create user in userData.json with all the user data
      await userService.createUser(uid, {
        firstName: resolvedFirstName ?? '',
        lastName: resolvedLastName ?? '',
        email: email ?? 'no-email@example.com',
        userType: userType ?? 'student',
        mobile: phoneNumber ?? phone_number ?? '',
        phoneNumber: phoneNumber ?? phone_number ?? '',
      });

      console.log("New user created with custom ID:", customUserId, "userType:", userType, "firstName:", resolvedFirstName, "lastName:", resolvedLastName);
    } else {
      // Update existing user's userType, firstName, lastName, phoneNumber if provided
      const updateFields = {};
      if (userType) updateFields.userType = userType;
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (phoneNumber) updateFields.phoneNumber = phoneNumber;
      if (Object.keys(updateFields).length > 0) {
        await userRef.update(updateFields);
        console.log("Updated user fields for existing user:", email ?? uid, updateFields);
      } else {
        console.log("Existing user logged in:", email ?? uid);
      }
    }

    return res.json({ redirectUrl: '/profile' });
  } catch (err) {
    console.error("Error saving user:", err.message);
    return res.status(500).json({ error: 'Failed to save user info' });
  }
});

const port = 3000;
app.listen(port, (error) => {
  if (error) {
    console.log(`App Failed at port :${port}`);
  } else {
    console.log(`App running at http://localhost:${port}`);
  }
});
