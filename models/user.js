const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
