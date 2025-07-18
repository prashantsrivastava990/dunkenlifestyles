const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  image: String,
  category: {
    type: String,
    enum: ['shirt', 'hoodie', 'sweatshirt'], // ✅ restrict allowed categories
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
