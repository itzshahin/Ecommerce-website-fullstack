const mongoose = require("mongoose");
const nodemailer = require('nodemailer'); 
require('dotenv').config(); 

const EMAIL_USER="shahinshahies786@gmail.com"      
const EMAIL_PASS="oplu almp bhdt pbhn"  

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  hoverImage: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

productSchema.pre('save', async function (next) {
  const product = this;
  
  console.log('Checking stock for:', product.name);
  console.log('Current stock:', product.stock);


  if (product.isModified('stock') && product.stock <= 5) {
    console.log('Stock is low, sending alert...');
    await sendStockAlert(product); 
  }

  next();
});

async function sendStockAlert(product) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,  
      pass: EMAIL_PASS,   
    },
  });

  
  const mailOptions = {
    from: EMAIL_USER,
    to: 'shaahinshahies7@gmail.com', 
    subject: `Dear Team,

We wanted to bring to your attention that the stock levels for the following product are running critically low:

Product Name: ${product.name}
Current Stock: ${product.stock} items remaining

To ensure uninterrupted availability and customer satisfaction, we recommend restocking this item as soon as possible. Please take immediate action to replenish the stock to avoid any potential shortages.
 ${product.name}`,
    text: `http://localhost:3000/AddProduct`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Stock alert email sent successfully!');
  } catch (error) {
    console.error('Error sending stock alert email:', error);
  }
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
