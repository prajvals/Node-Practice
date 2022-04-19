const mongoose = require('mongoose');

//you can send any other data apart from what is defined in the schema
//but only what is defined in the schema would be the one taken up
//rest will be discarded
//also if there are validation errors which come when a required value is missing
//of the unique property is not satisfied, then we will have errors too
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour should have a name'],
      unique: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
    },
    duration: {
      type: String,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: String,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour should have a price'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    //note we have to enable the virtual in the toJSON, these are the schema options
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
