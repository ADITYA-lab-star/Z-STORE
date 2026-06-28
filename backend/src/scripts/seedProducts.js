require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/zstore";

// ─── Category configs ────────────────────────────────────────────────────────
const categoryConfigs = [
  {
    name: "Audio",
    image: "/headphone.png",
    brands: ["SoundCore", "Aura", "BassLab", "PureAudio", "EchoWave", "SonicBolt", "AuraBuds", "DeepSound", "HiRes", "ZenAudio"],
    models: ["Pro X", "Elite", "Studio", "Premium", "Ultra", "Signature", "Reference", "Air", "Max", "Plus"],
    basePrices: [99, 149, 199, 249, 349, 499, 699, 999],
    baseSpecs: { connectivity: "Bluetooth 5.3", noiseCancellation: "Active", driver: "40mm Dynamic", batteryLife: "30 hours", charging: "USB-C Fast Charge", weight: "250g", foldable: true },
  },
  {
    name: "Wearables",
    image: "/smartwatch.png",
    brands: ["ChronoTech", "PulseWatch", "VitaBand", "TitanWear", "QuantumFit", "ApexBand", "ZenWrist", "HaloWatch", "AtomBand", "NovaBand"],
    models: ["Series 1", "Ultra", "Pro", "Active", "Sport", "Elite", "Max", "Classic", "Fit", "Slim"],
    basePrices: [149, 199, 299, 399, 499, 699, 799],
    baseSpecs: { display: "1.8\" AMOLED", batteryLife: "14 days", GPS: true, waterResistance: "5ATM", heartRateSensor: true, sleepTracking: true, stressMonitor: true },
  },
  {
    name: "Computing",
    image: "/laptop.png",
    brands: ["ZenithBook", "CoreSlate", "ArcBook", "NexPad", "PixelBook", "SwiftBook", "ProSlate", "UltraDesk", "QuantumPC", "VoidBook"],
    models: ["X1", "Z5", "Pro 14", "Air", "Ultra", "Plus", "Max", "Slim", "Studio", "Apex"],
    basePrices: [799, 999, 1199, 1499, 1899, 2299, 2799],
    baseSpecs: { RAM: "16GB", storage: "512GB NVMe SSD", display: "14\" IPS", GPU: "Integrated", battery: "72Wh", OS: "Windows 11", webcam: "1080p", ports: "USB-C x2, USB-A x1, HDMI" },
  },
  {
    name: "Accessories",
    image: "/keyboard.png",
    brands: ["ApexGear", "MechStrike", "ProKey", "SwiftKeys", "ZoneKeys", "PrecisionLab", "FocusGear", "NitroKeys", "AlphaBoard", "SilverKeys"],
    models: ["RGB Pro", "Compact", "TKL Plus", "75%", "Full-Size", "Ultra Slim", "Wireless", "Tactile", "Linear", "Clicky"],
    basePrices: [49, 79, 99, 129, 169, 199, 249],
    baseSpecs: { switches: "Mechanical Blue", layout: "TKL", backlight: "RGB Per-Key", connectivity: "USB-C", pollingRate: "1000Hz", antiGhosting: "N-Key Rollover", keycaps: "PBT Double-Shot" },
  },
  {
    name: "Mobile",
    image: "/phone.png",
    brands: ["PhantomX", "NovaPhone", "PrismMobile", "VoltPhone", "AuraPhone", "ZenPhone", "CorePhone", "ApexMobile", "StarPhone", "PixelDroid"],
    models: ["Ultra", "Pro Max", "Plus", "Lite", "FE", "Standard", "Compact", "Fold", "Flip", "Gaming"],
    basePrices: [299, 499, 699, 899, 1099, 1299, 1499],
    baseSpecs: { processor: "Snapdragon 8 Gen 3", RAM: "12GB", storage: "256GB", display: "6.7\" AMOLED 120Hz", battery: "5000mAh", charging: "67W Fast Charging", cameras: "Triple Camera System", fingerprint: "Under-display" },
  },
  {
    name: "Creation",
    image: "/earbuds.png",
    brands: ["LensForge", "PixelLab", "ChromaCam", "ShutterPro", "ApertureTech", "VividShot", "FocusCraft", "VistaCam", "RealShot", "ClearLens"],
    models: ["Creator Pro", "Studio Mk2", "Vlog Edition", "Cinema", "Alpha", "Mirrorless X", "Prime Series", "APS-C", "Full Frame", "Compact"],
    basePrices: [399, 599, 799, 999, 1299, 1699, 2099, 2999],
    baseSpecs: { sensor: "24MP APS-C", videoResolution: "4K 60fps", stabilization: "5-axis IBIS", autofocus: "Hybrid AF 425 points", battery: "740mAh", connectivity: "WiFi 6 + Bluetooth", weatherSealing: "IPX4", lensMount: "E-Mount" },
  },
];

// ─── Description templates ────────────────────────────────────────────────────
const descTemplates = [
  "Engineered for those who demand the best. Premium build quality meets cutting-edge performance in this flagship offering.",
  "The perfect balance of power and portability. Designed for modern professionals who refuse to compromise.",
  "Precision-crafted components deliver an unrivaled experience that sets a new benchmark in the category.",
  "Built to push limits. Whether you're a creator, gamer, or professional, this device rises to every challenge.",
  "A masterclass in design and technology. Every detail has been carefully considered to delight even the most discerning users.",
  "Next-generation internals wrapped in a sleek, premium chassis. Performance that speaks for itself.",
  "Redefining expectations with industry-leading specs and an immersive user experience straight out of the box.",
  "Handpicked for our collection for its exceptional quality, reliability, and long-term value. A true workhorse.",
];

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function generateProducts() {
  const products = [];
  const TARGET_PER_CAT = 20;

  for (const cat of categoryConfigs) {
    for (let i = 0; i < TARGET_PER_CAT; i++) {
      const brand = cat.brands[i % cat.brands.length];
      const model = cat.models[i % cat.models.length];
      const version = i < cat.brands.length ? "" : ` v${Math.floor(i / cat.brands.length) + 2}`;
      const name = `${brand} ${model}${version}`;
      const basePrice = cat.basePrices[i % cat.basePrices.length];
      // Vary price by ±20%
      const price = parseFloat((basePrice * (0.82 + Math.random() * 0.36)).toFixed(2));
      const stock = randomBetween(0, 200);
      const views = randomBetween(0, 8000);
      const desc = descTemplates[i % descTemplates.length];

      // Add some per-product variation to specs
      const specs = { ...cat.baseSpecs };
      if (cat.name === "Computing") {
        const ramOptions = ["8GB", "16GB", "32GB", "64GB"];
        const storageOptions = ["256GB NVMe SSD", "512GB NVMe SSD", "1TB NVMe SSD", "2TB NVMe SSD"];
        specs.RAM = ramOptions[i % ramOptions.length];
        specs.storage = storageOptions[i % storageOptions.length];
      }
      if (cat.name === "Mobile") {
        const ramOptions = ["8GB", "12GB", "16GB", "24GB"];
        specs.RAM = ramOptions[i % ramOptions.length];
      }

      products.push({ name, price, stock, category: cat.name, description: desc, image: cat.image, views, specifications: specs });
    }
  }

  return products;
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected for seeding...");

    await Product.deleteMany({});
    console.log("🗑️  Existing products cleared.");

    const products = generateProducts();
    const inserted = await Product.insertMany(products);

    console.log(`\n🌱 Successfully seeded ${inserted.length} products across ${categoryConfigs.length} categories!\n`);
    const summary = categoryConfigs.map(c => ({ category: c.name, count: inserted.filter(p => p.category === c.name).length }));
    console.table(summary);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected.");
  }
};

seedDatabase();
