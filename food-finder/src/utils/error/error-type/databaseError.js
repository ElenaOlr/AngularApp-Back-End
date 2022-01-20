const AppError = require('../appError');

exports.handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue);
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

exports.handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => {
    return el.message;
  });
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};
