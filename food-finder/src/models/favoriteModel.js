const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  foodId: {
    type: String,
    required: true,
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
