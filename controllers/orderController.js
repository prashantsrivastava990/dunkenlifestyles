const Order = require('../models/Order');
const User = require('../models/User');

// ✅ USER: Place a new order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalPrice, address, phone, paymentMethod } = req.body;

    // Validate required fields
    if (!items || items.length === 0 || !address || !phone || !paymentMethod) {
      return res.status(400).json({
        message: 'Please provide address, phone, payment method and at least one item.'
      });
    }

    const formattedItems = items.map(item => ({
      productId: item.productId || item._id, // frontend may send _id or productId
      quantity: item.quantity || 1
    }));

    const newOrder = new Order({
      user: userId,
      items: formattedItems,
      totalPrice,
      address,
      phone,
      paymentMethod,
      status: 'Pending'
    });

    await newOrder.save();

    res.status(201).json({ message: '✅ Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('❌ Order creation error:', err);
    res.status(500).json({ message: 'Server error while placing order' });
  }
};

// ✅ ADMIN: Get all orders with product details populated
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'fullname email')
      .populate('items.productId', 'title price') // ✅ populate product details
      .sort({ createdAt: -1 });

    // Optional: flatten product info into each item for easy frontend rendering
    const formatted = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        title: item.productId?.title || 'Unknown Product',
        price: item.productId?.price || 0,
        quantity: item.quantity
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Fetching orders failed:', err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// ✅ USER: Get orders placed by the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate('items.productId', 'title price')
      .sort({ createdAt: -1 });

    const formatted = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        title: item.productId?.title || 'Unknown Product',
        price: item.productId?.price || 0,
        quantity: item.quantity
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Fetching user orders failed:', err);
    res.status(500).json({ message: 'Server error while fetching your orders' });
  }
};

// ✅ ADMIN: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
      .populate('user', 'fullname email')
      .populate('items.productId', 'title price');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const formatted = {
      ...updatedOrder.toObject(),
      items: updatedOrder.items.map(item => ({
        title: item.productId?.title || 'Unknown Product',
        price: item.productId?.price || 0,
        quantity: item.quantity
      }))
    };

    res.json({ message: '✅ Order status updated', order: formatted });
  } catch (err) {
    console.error('❌ Order status update failed:', err);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus
};
