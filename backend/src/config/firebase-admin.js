const admin = require('firebase-admin');

// Note: In a production environment, you should download your Firebase Admin 
// Service Account Key JSON file from the Firebase Console (Project Settings > Service Accounts),
// save it securely on your server, and require it here. 
// For now, we will assume you have it saved as 'serviceAccountKey.json' in the config folder.
// If it doesn't exist, this will throw an error when running the server, so you must add it!

try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.warn("Firebase Admin failed to initialize. Please ensure serviceAccountKey.json exists in backend/src/config/.");
  // Fallback to default if ENV variable GOOGLE_APPLICATION_CREDENTIALS is set
  try {
    admin.initializeApp();
    console.log("Firebase Admin initialized via applicationDefault().");
  } catch (err) {
    console.error("No valid Firebase Admin credentials found.");
  }
}

module.exports = admin;
