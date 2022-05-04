const mongoose = require('mongoose');
const validator = require('validator');
//name,email,photo,password,passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter your Name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
