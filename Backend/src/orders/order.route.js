const express = require('express');
const router = express.Router();
const Order = require('./order.model');
const { createAnOrder,getOrderByEmail, getAllOrders, updateOrderStatus } = require('./order.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

//create order endpoint
router.post('/', createAnOrder);

// get orders by user email
router.get("/email/:email",getOrderByEmail);

// admin: get all orders
router.get('/', verifyAdminToken, getAllOrders);

// admin: update order status
router.patch('/status/:id', verifyAdminToken, updateOrderStatus);

module.exports = router;