const jwt = require('jsonwebtoken');
const SocialUser = require('../models/socialUserModel');
const Food = require('../models/foodModel');
const Favorite = require('../models/favoriteModel');
const catchAsync = require('../utils/error/catchAsync');
const appText = require('../utils/AppText.json');
const cookiesToObject = require('../utils/functions');
const { ObjectId } = require('mongodb');
const AppError = require('../utils/error/appError');
const { verify } = require('../services/verifyToken');

exports.addFoodToFavUser = catchAsync(async (req, res, next) => {
  const foodId = req.params.id;
  const foodDocument = await Food.findOne({ _id: ObjectId(foodId) });

  if (foodDocument) {
    if (req.headers.cookie) {
      const cookieObject = cookiesToObject(req.headers.cookie);
      if (cookieObject.jwt) {
        const userId = jwt.verify(cookieObject.jwt, process.env.JWT_SECRET).id;

        const response = await Favorite.create({
          userId: userId,
          foodId: foodId,
        });

        res.status(200).send({ status: appText.status.success, message: 'Food added to favorites.', item: response });
        return;
      }
      return next(new AppError(appText.errors.token.invalid, 403));
    }
    return next(new AppError(appText.errors.token.missing, 403));
  }
  return next(new AppError(appText.errors.id.notFound, 400));
});

exports.addFoodToFavSoc = catchAsync(async (req, res, next) => {
  const foodId = req.params.id;
  const foodDocument = await Food.findOne({ _id: ObjectId(foodId) });

  if (foodDocument) {
    if (req.body.token) {
      const userData = await verify(req.body.token).catch(() => {
        return next(new AppError(appText.errors.token.invalid, 403));
      });
      if (!userData) return;

      const user = { sub: userData.sub, email: userData.email, name: userData.name };
      const userDocument = await SocialUser.findOne({ sub: user.sub });

      const response = await Favorite.create({
        userId: userDocument.id,
        foodId: foodId,
      });

      res.status(200).send({ status: appText.status.success, message: 'Food added to favorites.', item: response });
      return;
    }
    return next(new AppError(appText.errors.token.missing, 403));
  }
  return next(new AppError(appText.errors.id.notFound, 400));
});

exports.getFavFoodsUser = catchAsync(async (req, res, next) => {
  if (req.headers.cookie) {
    const cookieObject = cookiesToObject(req.headers.cookie);
    if (cookieObject.jwt) {
      const userId = jwt.verify(cookieObject.jwt, process.env.JWT_SECRET).id;

      const favoriteFoodList = await Favorite.find({
        userId: userId,
      });

      const foodList = [];
      await Promise.all(
        favoriteFoodList.map(async item => {
          await Food.findOne({ _id: ObjectId(item.foodId) }).then(food => {
            const favoriteFood = {
              id: item.id,
              foodId: food.id,
              name: food.name,
              quantity: food.quantity,
              restaurant: food.restaurant,
              img: food.img.toString('base64'),
              category: food.category,
              price: food.price,
              link: food.link,
            };
            foodList.push(favoriteFood);
          });
        }),
      );

      res.status(200).json({ status: appText.status.success, foodList: foodList });
      return;
    }
    return next(new AppError(appText.errors.token.invalid, 403));
  }
  return next(new AppError(appText.errors.token.missing, 403));
});

exports.getFavFoodsSoc = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    const userData = await verify(req.params.id).catch(() => {
      return next(new AppError(appText.errors.token.invalid, 403));
    });
    if (!userData) return;

    const user = { sub: userData.sub, email: userData.email, name: userData.name };
    const userDocument = await SocialUser.findOne({ sub: user.sub });

    const favoriteFoodList = await Favorite.find({
      userId: userDocument.id,
    });

    const foodList = [];
    await Promise.all(
      favoriteFoodList.map(async item => {
        await Food.findOne({ _id: ObjectId(item.foodId) }).then(food => {
          const favoriteFood = {
            id: item.id,
            foodId: food.id,
            name: food.name,
            quantity: food.quantity,
            restaurant: food.restaurant,
            img: food.img.toString('base64'),
            category: food.category,
            price: food.price,
            link: food.link,
          };
          foodList.push(favoriteFood);
        });
      }),
    );

    res.status(200).json({ status: appText.status.success, foodList: foodList });
    return;
  }
  return next(new AppError(appText.errors.token.missing, 403));
});

exports.deleteFavFoodUser = catchAsync(async (req, res, next) => {
  const favoriteId = req.params.id;
  if (req.headers.cookie) {
    const cookieObject = cookiesToObject(req.headers.cookie);
    if (cookieObject.jwt) {
      const userId = jwt.verify(cookieObject.jwt, process.env.JWT_SECRET).id;

      await Favorite.deleteOne({
        _id: ObjectId(favoriteId),
        userId: userId,
      });

      res.status(200).json({ status: appText.status.success, message: 'Food deleted from favorites list.' });
      return;
    }
    return next(new AppError(appText.errors.token.invalid, 403));
  }
  return next(new AppError(appText.errors.token.missing, 403));
});

exports.deleteFavFoodSoc = catchAsync(async (req, res, next) => {
  const favoriteId = req.params.id;
  if (req.body.token) {
    const userData = await verify(req.body.token).catch(() => {
      return next(new AppError(appText.errors.token.invalid, 403));
    });
    if (!userData) return;

    const user = { sub: userData.sub, email: userData.email, name: userData.name };
    const userDocument = await SocialUser.findOne({ sub: user.sub });

    await Favorite.deleteOne({
      _id: ObjectId(favoriteId),
      userId: userDocument.id,
    });

    res.status(200).json({ status: appText.status.success, message: 'Food deleted from favorites list.' });
    return;
  }

  return next(new AppError(appText.errors.token.missing, 403));
});
