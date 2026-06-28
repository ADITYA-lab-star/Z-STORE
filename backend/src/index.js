const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

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
app.use(express.json());
// Serve product images statically
app.use("/images", express.static(path.join(__dirname, "../public/images")));

const authRoutes = require("./routes/authRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);
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

// 3. Simulated Stripe Webhook that processes an order and emits the event
app.post("/api/webhooks/stripe-success", async (req, res) => {
  try {
    // Accept robust payload or fallback to old simulator payload
    const items = req.body.items || [{ productId: req.body.productId, quantityBought: req.body.quantityBought }];
    const firebaseUid = req.body.firebaseUid || "anonymous";
    const totalAmount = req.body.totalAmount || 0;
    const sessionId = req.body.sessionId || "simulated_session";

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Missing items" });
    }

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

        // Broadcast the real-time stock update to ALL connected WebSockets
        io.emit("inventory_updated", {
          productId: updatedProduct._id,
          newStock: updatedProduct.stock
        });
      }
    }

    // Save the new Order document tracking the user's history
    if (orderItems.length > 0 && firebaseUid !== "anonymous") {
      const newOrder = new Order({
        firebaseUid,
        items: orderItems,
        totalAmount: totalAmount > 0 ? totalAmount : calculatedTotal,
        stripeSessionId: sessionId
      });
      await newOrder.save();
    }

    return res.json({ success: true, processedItems: orderItems.length });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

// Standard Routes
app.get("/", (req, res) => {
  res.send("Running with Nodemon + Express + MongoDB + Socket.IO!");
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

app.post("/api/addprod", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

const PORT = process.env.PORT || 5000;
// 5. Mount the app on the HTTP server to support Socket.IO
server.listen(PORT, () => console.log(`Server listening on port ${PORT} with Socket.IO`));
