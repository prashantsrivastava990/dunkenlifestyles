const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authmiddleware');

// ✅ PUBLIC ROUTES — anyone can view products
router.get('/', getAllProducts);               // Fetch all products
router.get('/:id', getProductById);            // Fetch product by ID

// ✅ ADMIN ROUTES — protected with token + role check
router.post('/', protect, adminOnly, upload.single('image'), createProduct);   // Create new product with image
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct); // Update product with new image
router.delete('/:id', protect, adminOnly, deleteProduct);                      // Delete product by ID

module.exports = router;
