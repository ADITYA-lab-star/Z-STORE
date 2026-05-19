const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");

// Sync Firebase User with MongoDB
// This route should be called by the frontend immediately after successful login/signup
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user in MongoDB
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || req.body.name || "",
        photoURL: picture || req.body.photoURL || "",
      });
      await user.save();
      return res.status(201).json({ message: "User synced and created in DB", user });
    }

    res.status(200).json({ message: "User already exists in DB", user });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

module.exports = router;
