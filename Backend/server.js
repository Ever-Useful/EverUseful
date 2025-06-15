const express = require('express');
const cors = require('cors');
const authorize = require('./authorize');
const admin = require('firebase-admin');

const app = express();

// Initialize Firestore
//this is server
const db = admin.firestore();

app.use(cors({
  origin: '*', // In production, replace with your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/token', authorize, async (req, res) => {
  const { uid, name, email, picture, firebase } = req.user;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Use fallback values for missing fields
      await userRef.set({
        name: name ?? 'Anonymous',
        email: email ?? 'no-email@example.com',
        photo: picture ?? '',
        provider: firebase?.sign_in_provider ?? 'unknown',
        createdAt: new Date().toISOString()
      });
      console.log("New user created:", email ?? uid);
    } else {
      console.log("Existing user logged in:", email ?? uid);
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
