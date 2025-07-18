const Product = require('../models/Product');

// Create a product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const newProduct = new Product({ title, description, price, image, category });
    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get all products (Public)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get single product by ID (Public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update a product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
