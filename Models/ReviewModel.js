const mongoose = require('mongoose');

//review,rating,createdAt,ref to tour,ref to user
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
  },
  rating: {
    type: Number,
    min: [1, 'A rating cannot be less than 1'],
    max: [5, 'A rating cannot have more than 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A user must belong to a tour'],
  },
});

module.exports = mongoose.model('ReviewModel', reviewSchema);
