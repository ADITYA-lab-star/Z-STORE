const admin = require('firebase-admin');

// Note: In a production environment, you should download your Firebase Admin 
// Service Account Key JSON file from the Firebase Console (Project Settings > Service Accounts),
// save it securely on your server, and require it here. 
// For now, we will assume you have it saved as 'serviceAccountKey.json' in the config folder.
// If it doesn't exist, this will throw an error when running the server, so you must add it!

const fs = require('fs');
const path = require('path');

let serviceAccount = null;

// Array of possible paths where the service account key might be stored
const possiblePaths = [
  path.join(__dirname, 'serviceAccountKey.json'), // Local development
  '/etc/secrets/serviceAccountKey.json', // Render default secret files path
  path.join(__dirname, '../../serviceAccountKey.json'), // Root of backend folder
];

for (const keyPath of possiblePaths) {
  if (fs.existsSync(keyPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      console.log(`Found Firebase service account key at: ${keyPath}`);
      break;
    } catch (err) {
      console.warn(`Found file at ${keyPath} but failed to parse it as JSON.`);
    }
  }
}

try {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully with service account.");
  } else {
    // Fallback to Application Default Credentials (e.g. if GOOGLE_APPLICATION_CREDENTIALS is set)
    admin.initializeApp();
    console.log("Firebase Admin initialized via applicationDefault().");
  }
} catch (error) {
  console.error("CRITICAL ERROR: No valid Firebase Admin credentials found. Firebase Admin failed to initialize.", error);
}

module.exports = admin;
