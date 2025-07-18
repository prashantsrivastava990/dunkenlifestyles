const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authmiddleware');

// Register new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Protected route: accessible only with valid token
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Welcome to your profile',
    user: req.user
  });
});

module.exports = router;
