const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('./order.model');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create a Razorpay Order (server-side)
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees from frontend

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise (1 ₹ = 100 paise)
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create payment order', error: error.message });
    }
};

// Step 2: Verify payment signature & save order to DB
const verifyPaymentAndCreateOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData, // the full order details from frontend
        } = req.body;

        // Verify HMAC-SHA256 signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
        }

        // Signature is valid — save order to DB
        const newOrder = new Order({
            ...orderData,
            paymentMethod: 'Online',
            paymentStatus: 'Paid',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Payment verified and order placed!', order: savedOrder });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Payment verification error', error: error.message });
    }
};

module.exports = { createRazorpayOrder, verifyPaymentAndCreateOrder };
