const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  type: {
    type: String, 
    required: true, 
    enum:[
      'flight', 
      'rental', 
      'cruise', 
      'housing',
      'dining',
      'activity',
      'meeting',
      'map',
      'direction',
      'other', 
    ]
  },
  description: String,
  location: String,
  locationName: String,
  address: String,
  endAddress: String,
  checkIn: {type: Date, required:true},
  checkOut: Date,
  notes: String,
  confirmation: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

PlanSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Plan', PlanSchema);