const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  name: String,
  destination: {type:String, required: true},
  startDate: {type:Date, required:true},
  description: String,
  isTraveler: Boolean,
  days: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Day'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

TripSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Trip', TripSchema);