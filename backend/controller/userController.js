const User = require("../Model/userSchema");
const Order = require("../Model/OrderSchema.js");
const Product = require("../Model/productSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const jwtSecretKey = "strts65464";
const EMAIL_USER = "shahinshahies786@gmail.com"
const EMAIL_PASS = "oplu almp bhdt pbhn"

const createUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log("user", user);
        if (user) {
            return res.status(409).json({ error: "Email already exists." });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        console.log("newUser", newUser);

        return res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }


        if (user) {
            if (user.isBanned) {
                return res.status(403).json({
                    error: 'Your account has been banned. Please contact admin.',
                    success: false
                });
            }

            const comparePwd = await bcrypt.compare(req.body.password, user.password);

            if (comparePwd) {
                const authToken = jwt.sign({ email: user.email }, jwtSecretKey, { expiresIn: '1d' });
                res.json({ success: true, authToken, user, userId: user._id });
                console.log(authToken);
            } else {
                res.status(400).json({ error: 'Incorrect password!', success: false });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const addToCart = async (req, res) => {
    const { userEmail, productId, quantity } = req.body;

    console.log("reqbody", req.body);
    try {
        const user = await User.findOne({ email: userEmail });

        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItem = user.cart.find(item => item.product_id.equals(productId));

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({
                product_id: productId,
                quantity: quantity,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateCartQuantity = async (req, res) => {
    const { userEmail, productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItem = user.cart.find(item => item.product_id.equals(productId));

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getCart = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const removeCart = async (req, res) => {
    const { userEmail, productId } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.cart = user.cart.filter(product => product.product_id.toString() !== productId);
        await user.save();

        console.log("cart", user.cart);

        res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error in removeCart:", error);
        res.status(500).json({ message: 'Failed to remove item from cart', error });
    }
};
const buyNow = async (req, res) => {
    try {
        const { email } = req.params;
        const { productId, quantity, address, paymentMethod } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }

        product.stock -= quantity;
        await product.save();

        const newOrder = new Order({
            user: user._id,
            orderItems: [{
                product_id: productId,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity,
                category: product.category,
            }],
            paymentMethod,
            address,
            totalAmount: product.price * quantity
        });

        await newOrder.save();

        res.status(200).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error("Error in buyNow:", err);
        res.status(500).json({ message: 'Failed to place order', error: err.message });
    }
};


const toggleWishlist = async (req, res) => {
    const { userEmail, product } = req.body;

    if (!userEmail || !product || !product.product_id) {
        return res.status(400).json({ message: 'userEmail and product are required' });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: "User is banned and cannot modify wishlist." });
        }

        const existingItem = user.wishlist.find(item => item.product_id.equals(product.product_id));

        if (existingItem) {
            user.wishlist = user.wishlist.filter(item => !item.product_id.equals(product.product_id));
            await user.save();
            return res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
        } else {
            user.wishlist.push(product);
            await user.save();
            return res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        console.error("Error in toggleWishlist:", error);
        res.status(500).json({ message: 'Failed to modify wishlist', error });
    }
};

const removeWishlist = async (req, res) => {
    const { userEmail, productId } = req.body;
    console.log("req.body@removewishlist", req.body);


    try {
        if (!userEmail || !productId) {
            return res.status(400).json({ message: 'userEmail and productId are required' });
        }

        console.log("Removing product from wishlist", { userEmail, productId });

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        console.log("Current wishlist:", user.wishlist);


        const productInWishlist = user.wishlist.find(item => item._id.toString() === productId);
        if (!productInWishlist) {
            return res.status(404).json({ message: 'Item not found in wishlist' });
        }

        user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
        await user.save();

        console.log("Updated wishlist:", user.wishlist);

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const getWishlist = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail }).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { email } = req.params;
        const { items, orderDetails, address } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        const newOrder = new Order({
            user: user._id,
            orderItems: items.map(item => ({
                product_id: item.product_id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
            })),
            paymentMethod: orderDetails.paymentMethod,
            address,
            totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0)
        });

        await newOrder.save();

        user.cart = [];
        user.orders.push(newOrder._id);
        await user.save();

        res.status(200).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Failed to place order', error: err.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        const orders = await Order.find({ user: user._id });
        console.log(user);

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
    }
};

const getUserOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        const orders = await Order.find({ user: user._id });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).send('Server error');
    }
};






const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const user = await User.findById(order.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.orders = user.orders.filter(id => id.toString() !== orderId);
        await user.save();

        await order.deleteOne();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const banUser = async (req, res) => {
    const { id } = req.params;

    try {
        const banneduser = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });
        if (!banneduser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User banned successfully', banneduser });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const unbanUser = async (req, res) => {
    const { id } = req.params;

    try {
        const unbannedUser = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true });
        if (!unbannedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User unbanned successfully', unbannedUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }


        const token = jwt.sign({ email }, jwtSecretKey, { expiresIn: "1d" });
        console.log("Generated token for forgot password:", token);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });


        const resetPasswordLink = `http://localhost:3000/user/resetpassword/${user._id}/${token}`;
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            text: `You requested a password reset. Please use the following link to reset your password: ${resetPasswordLink}. This link will expire in 24 hours.`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send reset email' });
            }
            console.log('Password reset email sent:', info.response);
            res.json({ success: true, message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        console.error('Error in forgot password process:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred' });
    }
};

const userResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, jwtSecretKey);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'The reset link has expired. Please request a new one.' });
        }
        res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
};



module.exports = { createUser, loginUser, getUser, addToCart, getCart, removeCart, toggleWishlist, getWishlist, updateCartQuantity, removeWishlist, placeOrder, getUserOrders, deleteOrder, banUser, unbanUser, buyNow, userForgotPassword, userResetPassword, getUserOrdersByEmail };