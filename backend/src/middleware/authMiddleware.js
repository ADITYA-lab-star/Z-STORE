const admin = require('../config/firebase-admin');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the decoded user information to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).json({ error: 'Forbidden. Invalid or expired token.' });
  }
};

const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Extract the role from custom claims (fallback to 'customer' if undefined)
      const userRole = decodedToken.role || 'customer';

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying role token:', error);
      return res.status(403).json({ error: 'Forbidden. Invalid or expired token.' });
    }
  };
};

module.exports = { requireAuth, verifyRole };
