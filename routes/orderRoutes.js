const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authmiddleware');

// ✅ USER ROUTE: Place an order
router.post('/', protect, placeOrder);

// ✅ USER ROUTE: View logged-in user's orders
router.get('/user', protect, getUserOrders);  // 👈 This is the missing route

// ✅ ADMIN ROUTES: View all orders, update order status
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
