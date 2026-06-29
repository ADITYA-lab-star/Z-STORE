const express = require('express');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/authMiddleware');

// Lazily initialize Stripe to prevent boot-time crashes if STRIPE_SECRET_KEY is not set
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
  }
  return require('stripe')(key);
};

const router = express.Router();

// Route is heavily protected by our custom Firebase requireAuth middleware
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items } = req.body; // Array of { productId, quantity }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 1. Fetch live prices directly from MongoDB to completely prevent client-side spoofing
    const productIds = items.map((item) => item.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== items.length) {
      return res.status(400).json({ error: 'Validation failed: Invalid product ID detected.' });
    }

    // 2. Map database products to the precise line_item format expected by Stripe
    let subtotal = 0;
    const line_items = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item.productId);
      subtotal += dbProduct.price * item.quantity;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: dbProduct.name,
            images: dbProduct.image ? [dbProduct.image] : [],
          },
          // Stripe expects integers (cents for USD)
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const shipping_options = subtotal >= 50 ? [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Free Shipping (Over $50)',
        }
      }
    ] : [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1000, currency: 'usd' },
          display_name: 'Standard Flat Rate Shipping',
        }
      }
    ];

    // 3. Generate the secure Stripe Checkout Session URL
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      shipping_options,
      // Inject Firebase UID for secure fulfillment via Webhooks later
      client_reference_id: req.user.uid,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
    });

    // 4. Return the unique Stripe URL to the frontend for redirection
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error generating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
