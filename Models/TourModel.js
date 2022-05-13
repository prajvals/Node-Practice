const mongoose = require('mongoose');
const slugify = require('slugify');

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
      minlength: [10, 'A tour should have a minimum length of atleast 10'],
      maxlength: [40, 'A tour should have a maximum length of 40'],
      unique: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be below 5'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either either easy,medium or difficult',
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour should have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.val > this.price;
        },
        message: 'Discount price cannot be more than the price itself',
      },
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
    secretTour: {
      type: Boolean,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
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
/*virtual properties are those which are derieved from some other property already stored in the database, and hence we dont save it, rather calculate it this way
it needs that we allow the schema properties to show virtuals in it alright yeah
*/
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});
/*
Mongoose has middlewares, which we can run for specific conditions, like we have middlewares which run for specific paths, there are four types of middlewares in it actually, and what we provide in the functions is the code which is actually run

so these .pre .post with hooks is just similar to paths on which to execute
*/
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //slug is the last part of the url usually used to identify the resource from it alright yeah
  next();
});

//post is called when the data has been successfully saved in the database
tourSchema.post('save', function (doc, next) {
  console.log(this);
  next();
});

//important thing to note, these are the mongoose middleware
//they run before or after the database operations are being done or already done alright yeah

//QUERY MIDDLEWARES
tourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: true }); //basically this here means query and we are chaining this find on it
});

tourSchema.post('/^find/', function (docs, next) {
  console.log(docs);
});

//AGGREGATOR MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

/*
see the startLocation is basically like, its a geoLocation setting up
in this we have the type as point alright 
and then in coordinates we have the number alright yeah
this special type is geoJson alright yeah
*/
