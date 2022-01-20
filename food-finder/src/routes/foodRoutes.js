const express = require('express');
const cardController = require('../controller/cardController');

const router = express.Router();

router.get('/', cardController.getAllFoods);
router.get('/random/:size',cardController.getRandomFoods);

module.exports = router;
