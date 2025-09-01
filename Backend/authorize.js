const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

console.log('Service Account Project ID:', serviceAccount.project_id);
console.log('Full service account content:', JSON.stringify(serviceAccount, null, 2));

// Force clear any existing Firebase apps
try {
  if (admin.apps.length > 0) {
    admin.apps.forEach(app => {
      if (app) {
        console.log('Deleting existing Firebase app with project:', app.options.projectId);
        app.delete();
      }
    });
  }
} catch (e) {
  console.log('No existing Firebase apps to clear');
}

// Initialize with explicit project ID from service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id, // Force use this project ID
});

console.log('Firebase Admin initialized with forced project ID:', serviceAccount.project_id);

const authorize = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authorize;



