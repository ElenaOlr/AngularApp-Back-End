const express = require('express');

const catchAsync = require('../utils/error/catchAsync');
const foodModel = require('../models/foodModel');

const router = express.Router();
router.get(
  '/food',
  catchAsync(async (request, response) => {
    const foods = await foodModel.find({});

    foods ? response.send(foods) : response.status(500).send(error);
  }),
);
router.post(
  '/food',
  catchAsync(async (request, response) => {
    const food = new foodModel(request.body);

    const foodSave = food.save();
    foodSave ? response.send(food) : response.status(500).send(error);
  }),
);

router.patch(
  '/food/:id',
  catchAsync(async (request, response) => {
    const food = await foodModel.findByIdAndUpdate(request.params.id, request.body);

    food ? response.send(food) : response.status(500).send(error);
  }),
);

router.delete(
  '/food/:id',
  catchAsync(async (request, response) => {
    const food = await foodModel.findByIdAndDelete(request.params.id);

    food ? response.status(200).send() : response.status(500).send();
  }),
);

module.exports = router;
