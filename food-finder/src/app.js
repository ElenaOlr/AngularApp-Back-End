require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const AppError = require('./utils/error/appError');
const errorHandler = require('./utils/error/errorHandler');
const userRouter = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const foodRouter = require('./routes/foodRoutes');

const upload = require('./routes/upload');

const app = express();
app.use(cors({ origin: true, credentials: true }));

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mongoSanitize());

app.use(xss());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/food', foodRouter);
app.use('/api/v1/favorites', favoriteRoutes);

app.use('/', upload);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(errorHandler);

module.exports = app;
