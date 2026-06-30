const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Lazy initialize Stripe to prevent boot crashes if key is missing locally
const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.IO alongside Express
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Optionally attach io to app if you want routes in other files to emit events
app.set("io", io);

app.use(cors({ origin: "*" }));

// 3. Real Stripe Webhook (must come before express.json)
app.post("/api/webhooks/stripe-success", express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    console.warn("Stripe is not configured on this server");
    return res.status(500).json({ error: "Stripe is not configured" });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // In our checkout flow, we pass metadata.firebaseUid and metadata.items (JSON stringified)
    const firebaseUid = session.metadata?.firebaseUid || "anonymous";
    const itemsRaw = session.metadata?.items;
    
    if (itemsRaw) {
      try {
        const items = JSON.parse(itemsRaw);
        const orderItems = [];
        let calculatedTotal = 0;

        for (const item of items) {
          if (!item.productId || !item.quantityBought) continue;

          // Decrement the stock securely in MongoDB
          const updatedProduct = await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -Math.abs(item.quantityBought) } },
            { new: true }
          );

          if (updatedProduct) {
            orderItems.push({
              productId: updatedProduct._id,
              name: updatedProduct.name,
              price: updatedProduct.price,
              quantity: item.quantityBought
            });
            calculatedTotal += (updatedProduct.price * item.quantityBought);

            // Broadcast the real-time stock update
            io.emit("inventory_updated", {
              productId: updatedProduct._id,
              newStock: updatedProduct.stock
            });
          }
        }

        if (orderItems.length > 0 && firebaseUid !== "anonymous") {
          const newOrder = new Order({
            firebaseUid,
            items: orderItems,
            totalAmount: session.amount_total / 100, // Stripe amount is in cents
            stripeSessionId: session.id,
            status: "pending"
          });
          await newOrder.save();
        }
      } catch (err) {
        console.error("Error processing webhook metadata:", err);
      }
    }
  }

  res.json({ received: true });
});

// Parse JSON bodies for all other routes
app.use(express.json());
// Serve product images statically
app.use("/images", express.static(path.join(__dirname, "../public/images")));

const authRoutes = require("./routes/authRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Rate limiters
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const checkoutLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/checkout", checkoutLimiter, checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Models
const Product = require("./models/Product");
const Order = require("./models/Order");

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// 2. Listen for Socket Connections
io.on("connection", (socket) => {
  console.log("Client connected for live inventory updates:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// Standard Routes
app.get("/", (req, res) => {
  res.send("Running with Nodemon + Express + MongoDB + Socket.IO!");
});

// Flash Sale Route
const FlashSale = require("./models/FlashSale");
app.get("/api/flash-sale/active", async (req, res) => {
  try {
    const activeSale = await FlashSale.findOne({ isActive: true }).populate("productId");
    if (!activeSale || !activeSale.productId) {
      return res.status(404).json({ error: "No active flash sale" });
    }
    res.json(activeSale);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active flash sale" });
  }
});

app.get("/api/products/trending", async (req, res) => {
  try {
    // Trending logic: sort by views (descending), then by newest (descending)
    // Limit to top 10 to keep the trending section curated
    const trendingProducts = await Product.find()
      .sort({ views: -1, createdAt: -1 })
      .limit(10);
    res.json(trendingProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}); 

app.get("/api/products/:id", async (req, res) => {
  try {
    // Increment views automatically when a single product is fetched
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});


const PORT = process.env.PORT || 5000;
// 5. Mount the app on the HTTP server to support Socket.IO
server.listen(PORT, () => console.log(`Server listening on port ${PORT} with Socket.IO`));
