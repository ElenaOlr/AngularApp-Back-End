const Food = require('../models/foodModel');
const APIFeatures = require('../utils/APIFeatures');
const appText = require('../utils/AppText.json');
const catchAsync = require('../utils/error/catchAsync');

exports.getAllFoods = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Food.find(), req.query).filter().sort().limitFields().paginate();
  const foods = await features.query;

  const newFoods = foods.map(food => {
    const newEl = {
      _id: food._id,
      name: food.name,
      quantity: food.quantity,
      restaurant: food.restaurant,
      img: food.img.toString('base64'),
      category: food.category,
      price: food.price,
    };
    return newEl;
  });

  res.status(200).json({
    status: appText.status.success,
    results: foods.length,
    data: newFoods,
  });
});

exports.getRandomFoods = catchAsync(async (req, res, next) => {
  const { size } = req.params;
  const foodData = await Food.aggregate([{ $sample: { size: Number(size) } }]);
  res.status(200).json({
    status: appText.status.success,
    results: foodData.length,
    data: foodData,
  });
});
