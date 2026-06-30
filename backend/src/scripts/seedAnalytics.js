/**
 * Seeds test analytics data: sample orders spread over the last 30 days.
 * Uses real products from the DB, so run AFTER seedProducts.js.
 * Usage: node src/scripts/seedAnalytics.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/zstore";

// Fake Firebase UIDs to represent different test customers
const testUids = [
  "test_user_analytics_001",
  "test_user_analytics_002",
  "test_user_analytics_003",
  "test_user_analytics_004",
  "test_user_analytics_005",
];

const statuses = ["pending", "processing", "shipped", "delivered", "delivered", "delivered"]; // weighted toward delivered

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDaysAgo(maxDays) {
  const d = new Date();
  d.setDate(d.getDate() - randomBetween(0, maxDays));
  d.setHours(randomBetween(8, 22), randomBetween(0, 59), 0, 0);
  return d;
}

const seedAnalytics = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected...");

    // Pull real product IDs from the database
    const products = await Product.find({}, "_id name price").lean();
    if (products.length === 0) {
      console.error("❌ No products found. Run seedProducts.js first.");
      return;
    }

    // Clear existing test orders
    await Order.deleteMany({ firebaseUid: { $in: testUids } });
    console.log("🗑️  Cleared old test orders.");

    const ordersToInsert = [];
    const TARGET_ORDERS = 35; // 35 realistic test orders

    for (let i = 0; i < TARGET_ORDERS; i++) {
      const uid = testUids[i % testUids.length];
      const itemCount = randomBetween(1, 3);
      const items = [];
      let totalAmount = 0;

      // Pick random products for this order
      for (let j = 0; j < itemCount; j++) {
        const p = products[randomBetween(0, products.length - 1)];
        const qty = randomBetween(1, 3);
        const price = parseFloat((p.price * (0.9 + Math.random() * 0.2)).toFixed(2));
        totalAmount += price * qty;
        items.push({
          productId: p._id,
          name: p.name,
          price,
          quantity: qty,
        });
      }

      // Add $10 shipping if under $50
      if (totalAmount < 50) totalAmount += 10;

      const createdAt = randomDaysAgo(30);
      const status = statuses[randomBetween(0, statuses.length - 1)];

      ordersToInsert.push({
        firebaseUid: uid,
        items,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status,
        stripeSessionId: `test_sess_${Date.now()}_${i}`,
        createdAt,
        updatedAt: createdAt,
      });
    }

    // Insert with timestamps bypassed using direct insertMany + timestamps: false trick
    const inserted = await Order.collection.insertMany(
      ordersToInsert.map((o) => ({
        ...o,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      }))
    );

    const totalRevenue = ordersToInsert.reduce((s, o) => s + o.totalAmount, 0);
    console.log(`\n🌱 Seeded ${inserted.insertedCount} test orders!`);
    console.log(`💰 Total test revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`📦 Status breakdown:`);
    const statusCount = {};
    ordersToInsert.forEach((o) => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
    console.table(statusCount);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected.");
  }
};

seedAnalytics();
