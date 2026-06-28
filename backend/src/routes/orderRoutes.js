const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const router = express.Router();

// Get order history for the authenticated user
router.get('/me', requireAuth, async (req, res) => {
  try {
    // Find all orders associated with this Firebase UID, sorted newest first
    const orders = await Order.find({ firebaseUid: req.user.uid }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

module.exports = router;
