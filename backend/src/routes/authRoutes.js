const express = require("express");
const router = express.Router();
const User = require("../models/User");
const admin = require("../config/firebase-admin");
const { requireAuth, verifyRole } = require("../middleware/authMiddleware");

// Sync Firebase User with MongoDB
// This route should be called by the frontend immediately after successful login/signup
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Check if user already exists by email since email is uniquely indexed
    let user = await User.findOne({ email: email });

    if (!user) {
      // Create entirely new user
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || req.body.name || "",
        photoURL: picture || req.body.photoURL || "",
      });
      await user.save();
      return res.status(201).json({ message: "User synced and created in DB", user });
    }

    // User exists but might have a missing or outdated firebaseUid (e.g. from legacy signup)
    let needsSave = false;
    if (user.firebaseUid !== uid) {
      user.firebaseUid = uid;
      needsSave = true;
    }
    
    // Update name and photo if they were provided and currently missing
    const newName = name || req.body.name;
    const newPhoto = picture || req.body.photoURL;
    if (newName && user.name !== newName) {
      user.name = newName;
      needsSave = true;
    }
    if (newPhoto && user.photoURL !== newPhoto) {
      user.photoURL = newPhoto;
      needsSave = true;
    }

    if (needsSave) {
      await user.save();
      return res.status(200).json({ message: "User updated in DB", user });
    }

    res.status(200).json({ message: "User already synced in DB", user });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

module.exports = router;
