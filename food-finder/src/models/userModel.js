const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    match: /.+@.+\..+/,
  },
  username: {
    type: String,
    required: [true, 'A user must have a username'],
    minLength: [3, 'A user must have at least 3 characters'],
    maxLength: [23, 'A user must have at most 23 characters'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 6,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (inputePassword, userPassword) {
  return await bcrypt.compare(inputePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
