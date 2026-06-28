const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./src/models/Product");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected for Seeding");

    // Clear existing products if needed (uncomment to wipe before seeding)
    await Product.deleteMany({});

    const laptops = [
      {
        name: "ProBook X15",
        price: 1299.99,
        stock: 50,
        category: "Computing",
        description: "High-performance laptop for professionals.",
        image: "https://example.com/images/probook-x15.png",
        specifications: {
          RAM: "16GB DDR4",
          Processor: "Intel Core i7-12700H",
          "Screen Size": "15.6 inches",
          Storage: "512GB NVMe SSD",
          GPU: "NVIDIA RTX 3050",
        },
      },
      {
        name: "Gamer Ultra G9",
        price: 2499.0,
        stock: 15,
        category: "Computing",
        description: "Ultimate gaming machine with top-tier cooling.",
        image: "https://example.com/images/gamer-ultra-g9.png",
        specifications: {
          RAM: "32GB DDR5",
          Processor: "AMD Ryzen 9 7900X",
          "Screen Size": "17.3 inches 240Hz",
          Storage: "2TB NVMe SSD",
          GPU: "NVIDIA RTX 4080",
          Cooling: "Liquid Metal + Vapor Chamber",
        },
      },
      {
        name: "SlimAir 13",
        price: 999.0,
        stock: 120,
        category: "Computing",
        description: "Lightweight and ultra-portable for everyday tasks.",
        image: "https://example.com/images/slimair-13.png",
        specifications: {
          RAM: "8GB LPDDR4x",
          Processor: "Apple M1",
          "Screen Size": "13.3 inches Retina",
          Storage: "256GB SSD",
          "Battery Life": "Up to 18 hours",
          Weight: "2.8 lbs",
        },
      },
    ];

    const accessories = [
      {
        name: "MX Master 3S",
        price: 99.99,
        stock: 200,
        category: "Accessories",
        description: "Advanced wireless mouse with precision scrolling.",
        image: "https://example.com/images/mx-master-3s.png",
        specifications: {
          Type: "Wireless",
          DPI: "4000",
          "Battery Life": "70 days",
          Connectivity: "2.4GHz USB + Bluetooth",
          Buttons: "8 programmable",
        },
      },
      {
        name: "Mechanical Keyboard RGB",
        price: 149.99,
        stock: 150,
        category: "Accessories",
        description: "Premium mechanical keyboard with RGB backlighting.",
        image: "https://example.com/images/mech-keyboard-rgb.png",
        specifications: {
          Type: "Mechanical",
          Switches: "Cherry MX",
          Layout: "Full-size 104-key",
          Lighting: "RGB Per-key",
          Connection: "USB-C Wired",
        },
      },
      {
        name: "USB-C Hub Pro",
        price: 79.99,
        stock: 180,
        category: "Accessories",
        description: "7-in-1 USB-C hub with HDMI and SD card reader.",
        image: "https://example.com/images/usb-c-hub.png",
        specifications: {
          Ports: "3x USB 3.0, 1x HDMI, SD/TF Card Reader",
          "Power Delivery": "100W",
          Compatibility: "USB-C devices",
          Material: "Aluminum",
        },
      },
    ];

    const audio = [
      {
        name: "Sony WH-1000XM5",
        price: 399.99,
        stock: 80,
        category: "Audio",
        description: "Industry-leading noise-canceling headphones.",
        image: "https://example.com/images/sony-wh1000xm5.png",
        specifications: {
          "Noise Canceling": "Yes",
          "Battery Life": "30 hours",
          Connectivity: "Bluetooth 5.0",
          Weight: "250g",
          Frequency: "4Hz - 40kHz",
        },
      },
      {
        name: "AirPods Pro",
        price: 249.99,
        stock: 120,
        category: "Audio",
        description: "Premium wireless earbuds with active noise cancellation.",
        image: "https://example.com/images/airpods-pro.png",
        specifications: {
          "Noise Canceling": "Yes",
          Battery: "6 hours (case: 30 hours)",
          Connectivity: "Bluetooth 5.3",
          Weight: "5.3g each",
          "Water Resistant": "IPX4",
        },
      },
    ];

    const wearables = [
      {
        name: "Apple Watch Ultra",
        price: 799.99,
        stock: 60,
        category: "Wearables",
        description: "Rugged smartwatch for extreme sports and adventures.",
        image: "https://example.com/images/apple-watch-ultra.png",
        specifications: {
          Display: "LTPO OLED 49mm",
          Battery: "Up to 36 hours",
          "Water Resistance": "100m",
          Processor: "Apple S8",
          Sensors: "Heart rate, ECG, Temperature",
        },
      },
      {
        name: "Fitbit Charge 5",
        price: 179.99,
        stock: 140,
        category: "Wearables",
        description: "Advanced fitness tracker with health monitoring.",
        image: "https://example.com/images/fitbit-charge-5.png",
        specifications: {
          Display: "AMOLED 1.04 inch",
          Battery: "7 days",
          "Water Resistance": "50m",
          Sensors: "Heart rate, SpO2, EDA, Temperature",
          Connectivity: "Bluetooth 4.0",
        },
      },
    ];

    const mobile = [
      {
        name: "iPhone 15 Pro",
        price: 999.99,
        stock: 100,
        category: "Mobile",
        description: "Latest flagship iPhone with advanced camera system.",
        image: "https://example.com/images/iphone-15-pro.png",
        specifications: {
          Display: "6.1 inch OLED 120Hz",
          Processor: "A17 Pro",
          Storage: "256GB",
          Camera: "48MP main + 12MP ultra-wide",
          Battery: "3274 mAh",
        },
      },
      {
        name: "Samsung Galaxy Tab S9",
        price: 799.99,
        stock: 75,
        category: "Mobile",
        description: "Premium tablet for productivity and entertainment.",
        image: "https://example.com/images/galaxy-tab-s9.png",
        specifications: {
          Display: "11 inch AMOLED 120Hz",
          Processor: "Snapdragon 8 Gen 2",
          Storage: "256GB",
          Battery: "13050 mAh",
          Cameras: "13MP rear + 12MP front",
        },
      },
    ];

    const creation = [
      {
        name: "Canon EOS R5",
        price: 3899.99,
        stock: 25,
        category: "Creation",
        description: "Professional mirrorless camera for content creators.",
        image: "https://example.com/images/canon-eos-r5.png",
        specifications: {
          Sensor: "Full-frame 45MP",
          Video: "8K RAW recording",
          Autofocus: "5655 AF points",
          Battery: "2250 shots per charge",
          ISO: "100-51200",
        },
      },
      {
        name: "DJI Air 3S",
        price: 999.99,
        stock: 45,
        category: "Creation",
        description: "Advanced drone for aerial photography and videography.",
        image: "https://example.com/images/dji-air-3s.png",
        specifications: {
          "Max Speed": "75.6 km/h",
          "Flight Time": "46 minutes",
          Camera: "48MP 1-inch sensor",
          Range: "15 km",
          Battery: "2970 mAh",
        },
      },
    ];

    await Product.insertMany([
      ...laptops,
      ...accessories,
      ...audio,
      ...wearables,
      ...mobile,
      ...creation,
    ]);
    console.log("Successfully seeded 15 products across all categories!");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
