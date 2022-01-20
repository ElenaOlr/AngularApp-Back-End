const express = require('express');
const router = express.Router();

const favoriteController = require('../controller/favoriteController');

router.post('/addFoodToFavUser/:id', favoriteController.addFoodToFavUser);

router.get('/getFavFoodsUser', favoriteController.getFavFoodsUser);

router.post('/addFoodToFavSoc/:id', favoriteController.addFoodToFavSoc);

router.get('/getFavFoodsSoc/:id', favoriteController.getFavFoodsSoc);

router.delete('/deleteFavFoodsUser/:id', favoriteController.deleteFavFoodsUser);

router.delete('/deleteFavFoodsSoc/:id', favoriteController.deleteFavFoodsSoc);

module.exports = router;
