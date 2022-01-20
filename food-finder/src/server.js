const mongoose = require('mongoose');

const config = require('./utils/config/config');
const app = require('./app');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(config.PORT, console.log(`Server is running on ${config.PORT}`));
  })
  .catch(err => {
    console.err('Connection unsuccessful', err);
  });
