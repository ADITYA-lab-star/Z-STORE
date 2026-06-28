const express = require("express");
const admin = require("../config/firebase-admin");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { verifyRole } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// All routes in this file are protected by verifyRole(['admin'])
router.use(verifyRole(["admin"]));

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalOrders, ordersToday, totalUsers, allProducts, revenueData] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      User.countDocuments(),
      Product.find({}, "stock name price"),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = allProducts.filter((p) => p.stock === 0);

    res.json({
      totalRevenue,
      totalOrders,
      ordersToday,
      totalUsers,
      totalProducts: allProducts.length,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─────────────────────────────────────────────
// PRODUCT MANAGEMENT
// ─────────────────────────────────────────────
router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create product", details: err.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update product", details: err.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ─────────────────────────────────────────────
// ORDER MANAGEMENT
// ─────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Emit real-time update to all connected clients so the customer's OrderHistory updates live
    const io = req.app.get("io");
    if (io) {
      io.emit("order_status_updated", { orderId: order._id.toString(), newStatus: status });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/users/:uid/role", async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["customer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'customer' or 'admin'." });
    }

    // Update Firebase custom claims
    await admin.auth().setCustomUserClaims(req.params.uid, { role });

    // Update role in MongoDB too
    await User.findOneAndUpdate({ firebaseUid: req.params.uid }, { role });

    res.json({ message: `Role '${role}' successfully assigned to user ${req.params.uid}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role", details: err.message });
  }
});

module.exports = router;
