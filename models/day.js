const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  content: String,
  plans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan'}]
}, {timestamps: true});

DaySchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Day', DaySchema);