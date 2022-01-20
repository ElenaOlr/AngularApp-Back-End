const socialModel = require('../models/socialUserModel');
const catchAsync = require('../utils/error/catchAsync');
const AppError = require('../utils/error/appError');
const { verify } = require('./verifyToken');
const appText = require('../utils/AppText.json');

exports.auth = catchAsync(async (req, res, next) => {
  if (!req.body.token) {
    return next(new AppError(appText.errors.token.missing, 403));
  }

  const userData = await verify(req.body.token).catch(() => {
    return next(new AppError(appText.errors.token.invalid, 403));
  });

  if (!userData) return;

  const user = { sub: userData.sub, email: userData.email, name: userData.name };
  const userDocument = await socialModel.findOne({ sub: user.sub });
  if (userDocument) {
    return res.status(201).json({ message: appText.messages.notFound, data: { user: userDocument } });
  }

  const newUser = await socialModel.create(user);
  return res.status(201).json({ message: appText.messages.created, data: { user: newUser } });
});
