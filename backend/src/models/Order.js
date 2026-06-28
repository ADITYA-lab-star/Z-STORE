const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, index: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'completed' }, // e.g. pending, processing, completed
  stripeSessionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
