const Review = require('./../Models/ReviewModel');
const globalErrorHandler = require('./AppErrorController');
const globalErrorObject = require('./../Utils/AppError');
const catchAsync = require('./../Utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) {
    filter = { tour: req.params.id };
  }
  const reviews = await Review.find(filter);
  if (reviews === null) {
    next(new globalErrorObject('No Records Found', 400));
  }
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  console.log(req.params);
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.id; //the name we use as id is the one used in the router too
  const newReview = req.body;
  const data = await Review.create(newReview);

  res.status(201).json({
    status: 'success',
    data: {
      review: data,
    },
  });
});
