var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false
  },
  activateState:{
    type: Boolean,
    default: false
  },
  activationTime: {
    type: Number,
    default: 0
  },
  verificationCode: {
    type: String,
    default: ""
  },
  registerDate: {
    type: Date
  },
  userType: {
    type: String,
    default: "User"
  }
});

UserSchema.set('toJSON', { virtuals: true });
var User = mongoose.model('User', UserSchema);
module.exports = User;
