const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const User = require('../models/userModel');
const catchAsync = require('../utils/error/catchAsync');
const AppError = require('../utils/error/appError');
const cookiesToObject = require('../utils/functions');
const appText = require('../utils/AppText.json');

const prepareToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = prepareToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: appText.status.success,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  sendToken(newUser, 201, res);
});

exports.verify = catchAsync(async (req, res, next) => {
  if (req.headers.cookie) {
    const cookieObject = cookiesToObject(req.headers.cookie);
    if (cookieObject.jwt) {
      const userId = jwt.verify(cookieObject.jwt, process.env.JWT_SECRET).id;
      const userData = await User.findOne({ _id: ObjectId(userId) });
      res.status(200).json({ status: appText.status.success, user: userData });
      return;
    }
  }
  res.status(200).json({ message: appText.errors.notFound });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(appText.errors.credentials.missing, 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(appText.errors.credentials.incorrect, 401));
  }

  sendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: appText.status.success, message: appText.messages.loggedOut });
};
