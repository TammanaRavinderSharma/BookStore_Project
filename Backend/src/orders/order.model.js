const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    address:{
        city:{
            type: String,
            required: true,
        },
        country: String,
        state : String,
        zipcode: String,
    },
    phone:{
        type: Number,
        required: true,
    },
    productIds:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        }
    ],
    totalPrice:{
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending',
    },
    trackingId: {
        type: String,
        default: () => 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }
    },{
        timestamps: true,
    })
    const Order = mongoose.model('Order', orderSchema);
    module.exports = Order;