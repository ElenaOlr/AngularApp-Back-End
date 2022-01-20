const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  restaurant: {
    type: String,
    required: true,
  },
  img: { type: Buffer },
  category: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Food', foodSchema);
