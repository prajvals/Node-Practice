const mongoose = require('mongoose');
const tourModel = require('./TourModel');

//review,rating,createdAt,ref to tour,ref to user
const reviewSchema = new mongoose.Schema(
  {
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
      ref: 'tours',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A user must belong to a tour'],
    },
  },
  {
    //note we have to enable the virtual in the toJSON, these are the schema options
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    bufferCommands: false,
  }
);

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  await tourModel.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};

//next can be used with post only when there is atleast one more parameter
//alone it cannot be used with post
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Reviews', reviewSchema);
