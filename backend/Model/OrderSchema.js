const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: String,
            image: String,
            price: Number,
            quantity: Number,
            category: String
        }
    ],
    paymentMethod: {
        type: String,
        required: true
    },
    address: {
        name: String,
        phone: String,
        email: String,
        address: String,
        zipCode: String
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;