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
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  createAnOrder,
  getOrderByEmail,
  getAllOrders,
  updateOrderStatus
};
