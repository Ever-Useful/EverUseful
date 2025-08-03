const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authorize = async (req, res, next) => {
  console.log('Authorization middleware called');
  const authorization = req.headers.authorization;
  console.log('Authorization header:', authorization ? 'Present' : 'Missing');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('No valid authorization header found');
    return res.status(401).send('No token provided');
  }

  const token = authorization.split('Bearer ')[1];
  console.log('Token extracted, length:', token.length);

  try {
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully, user UID:', decodedToken.uid);

    // Attach user info to the request object
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).send('Invalid or expired token');
  }
};

module.exports = authorize;



