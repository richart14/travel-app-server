const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  content: String,
  index: Number
}, {timestamps: true});

daySchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Day', daySchema);