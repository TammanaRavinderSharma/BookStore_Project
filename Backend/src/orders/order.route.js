const express = require('express');
const router = express.Router();
const Order = require('./order.model');
const { createAnOrder, getOrderByEmail, getAllOrders, updateOrderStatus } = require('./order.controller');
const { createRazorpayOrder, verifyPaymentAndCreateOrder } = require('./payment.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// ── Razorpay Payment Routes ─────────────────────────────────────────────
// Step 1: Create a Razorpay order (returns orderId + key)
router.post('/create-razorpay-order', createRazorpayOrder);
// Step 2: Verify payment signature + save order to DB
router.post('/verify-payment', verifyPaymentAndCreateOrder);

// ── Standard Order Routes ───────────────────────────────────────────────
// Create order endpoint (COD)
router.post('/', createAnOrder);

// Get orders by user email
router.get("/email/:email", getOrderByEmail);

// Admin: get all orders
router.get('/', verifyAdminToken, getAllOrders);

// Admin: update order status
router.patch('/status/:id', verifyAdminToken, updateOrderStatus);

module.exports = router;