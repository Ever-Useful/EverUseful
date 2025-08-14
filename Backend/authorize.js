const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authorize = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('No token provided');
  }

  const token = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user info to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).send('Invalid or expired token');
  }
};

module.exports = authorize;



