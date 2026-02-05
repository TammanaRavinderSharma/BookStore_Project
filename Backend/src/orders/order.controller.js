const Order = require('./order.model');

const createAnOrder = async (req, res) => {
  try {
    console.log("ORDER BODY:", req.body); // debug

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getOrderByEmail = async (req, res) => {
  try { 
    const { email } = req.params;
    const orders = await Order.find({ email}).sort({ createdAt: -1 });
    if(!orders){
      return  res.status(404).json({message:"No orders found for this email"})
    }
    res.status(200).json(orders);
    
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: error.message,})
  }
}
module.exports = {
  createAnOrder,
  getOrderByEmail
};
