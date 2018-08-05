const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {type:String, required:true},
  startDate: {type:Date, required:true}
});

tripSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Trip', tripSchema);