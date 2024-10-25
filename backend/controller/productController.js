const Product = require("../Model/productSchema.js");

const addProduct = async (req, res) => {
  try {
    const { name, image, hoverImage, category, price, stock } = req.body;
    if (!name || !image || !category || !price) {
      return res.status(400).send("All fields are required");
    }
    const product = new Product({ name, image, hoverImage, category, price, stock });
    await product.save();
    res.status(200).send("Product Added Successfully");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getProduct = async (req, res) => {
  try {
    const prodData = await Product.find();
    res.status(200).send(prodData);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Product ID is required");
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Deleted Successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, hoverImage, price, category, stock } = req.body;
    if (!id || !name || !image || !category || !price) {
      return res.status(400).send("All fields are required");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, image, hoverImage, category, price, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Updated Successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { addProduct, getProduct, deleteProduct, updateProduct, getProductById };