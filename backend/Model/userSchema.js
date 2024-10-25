const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    cart: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            name: String,
            price: Number,
            image: String,
            category: String
        }
    ],
    wishlist: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            image: String,
            price: Number
        }
    ],
    orders: {
        type: Array,
        required: true,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: [
        {
            house: {
                type: String,
                required: false
            },
            street: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            pin: {
                type: Number,
                required: false
            },
            phone: {
                type: Number,
                required: false
            }
        }
    ],
    isBanned: {
        type: Boolean,
        default: false,
    }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
