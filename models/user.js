
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function validateEmail(email) {
  const re = new RegExp('[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}','i');
  if (!email) {
    return true;
  }
  return re.test(email);
}
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  email: {
    type: String,
    validate: [validateEmail,'Validation of `{PATH}` failed with value `{VALUE}`']
  }
});

UserSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', UserSchema);