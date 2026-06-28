/**
 * One-time script to grant admin privileges to a Firebase user.
 * Usage: node src/scripts/setAdminRole.js <FIREBASE_USER_UID>
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const admin = require("../config/firebase-admin");

const uid = process.argv[2];

if (!uid) {
  console.error("❌ Please provide a Firebase UID as an argument.");
  console.error("   Usage: node src/scripts/setAdminRole.js <UID>");
  process.exit(1);
}

const setAdmin = async () => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    const user = await admin.auth().getUser(uid);
    console.log(`✅ Successfully set role: 'admin' for user: ${user.email} (${uid})`);
    console.log("   The user must log out and back in for the new claim to take effect.");
  } catch (error) {
    console.error("❌ Failed to set admin role:", error.message);
  } finally {
    process.exit(0);
  }
};

setAdmin();
