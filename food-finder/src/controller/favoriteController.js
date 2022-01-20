const favorite = require('../services/favorite');

exports.addFoodToFavUser = favorite.addFoodToFavUser;
exports.getFavFoodsUser = favorite.getFavFoodsUser;
exports.addFoodToFavSoc = favorite.addFoodToFavSoc;
exports.getFavFoodsSoc = favorite.getFavFoodsSoc;
exports.deleteFavFoodsUser = favorite.deleteFavFoodUser;
exports.deleteFavFoodsSoc = favorite.deleteFavFoodSoc;
