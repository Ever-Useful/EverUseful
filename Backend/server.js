const express = require('express');
const cors = require('cors');
const authorize = require('./authorize');
const admin = require('firebase-admin');
const marketplaceRoutes = require('./routes/marketplace');
const userRoutes = require('./routes/users');
const userService = require('./services/userService');

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

// Marketplace routes
app.use('/api/marketplace', marketplaceRoutes);

// User routes
app.use('/api/users', userRoutes);

app.get('/token', authorize, async (req, res) => {
  const { uid, name, email, picture, firebase } = req.user;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create custom user ID and save to both Firestore and userData.json
      const customUserId = await userService.generateCustomUserId();
      
      // Save to Firestore
      await userRef.set({
        customUserId: customUserId,
        name: name ?? 'Anonymous',
        email: email ?? 'no-email@example.com',
        photo: picture ?? '',
        provider: firebase?.sign_in_provider ?? 'unknown',
        userType: 'student', // Default userType for GET requests
        createdAt: new Date().toISOString()
      });

      // Create user in userData.json
      await userService.createUser(uid, {
        name: name ?? 'Anonymous',
        email: email ?? 'no-email@example.com',
        avatar: picture ?? '',
        userType: 'student'
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
  const { uid, name, email, picture, firebase } = req.user;
  const { userType, firstName, lastName } = req.body;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create custom user ID
      const customUserId = await userService.generateCustomUserId();
      
      // Create full name from firstName and lastName if provided, otherwise use Firebase token name
      const fullName = firstName && lastName 
        ? `${firstName} ${lastName}`.trim()
        : name ?? 'Anonymous';

      // Save to Firestore
      await userRef.set({
        customUserId: customUserId,
        name: fullName,
        email: email ?? 'no-email@example.com',
        photo: picture ?? '',
        provider: firebase?.sign_in_provider ?? 'unknown',
        userType: userType ?? 'student', // Use provided userType or default
        createdAt: new Date().toISOString()
      });

      // Create user in userData.json
      await userService.createUser(uid, {
        name: fullName,
        email: email ?? 'no-email@example.com',
        avatar: picture ?? '',
        userType: userType ?? 'student'
      });

      console.log("New user created with custom ID:", customUserId, "userType:", userType, "name:", fullName);
    } else {
      // Update existing user's userType if provided
      if (userType) {
        await userRef.update({
          userType: userType
        });
        console.log("Updated userType for existing user:", email ?? uid, "to:", userType);
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
