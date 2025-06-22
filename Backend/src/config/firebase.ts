import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export default admin; 