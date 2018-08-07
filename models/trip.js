const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: String,
  destination: {type:String, required: true},
  startDate: {type:Date, required:true},
  description: String,
  isTraveler: Boolean,
  days: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Day'}]
}, {timestamps: true});

tripSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Trip', tripSchema);