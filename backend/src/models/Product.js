const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  views: { type: Number, default: 0 }, // Tracks product popularity for trending section
  // Highly variable key-value pairs for specifications.
  // Using Map of Mixed allows any string key mapped to any value type.
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
