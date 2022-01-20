const mongoose = require('mongoose');

const socialUserSchema = new mongoose.Schema({
  // Unique google account identifier,
  // better than email since it won't ever change.
  sub: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

socialUserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.sub;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('SocialUser', socialUserSchema);
