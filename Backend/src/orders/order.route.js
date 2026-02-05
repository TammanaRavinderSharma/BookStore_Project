const express = require('express');
const router = express.Router();
const Order = require('./order.model');
const { createAnOrder,getOrderByEmail } = require('./order.controller');

//create order endpoint
router.post('/', createAnOrder);
// get orders by user email
router.get("/email/:email",getOrderByEmail);

module.exports = router;