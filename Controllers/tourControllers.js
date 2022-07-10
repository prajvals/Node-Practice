const tourModel = require('./../Models/TourModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/AppError');
const factory = require('./../Utils/Factory');

exports.Aliasing = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

//ROUTE HANDLERS
exports.getAllTours = factory.getAll(tourModel, 'Tour', {});
exports.getParticularTour = factory.getOne(tourModel, 'Tour', 'reviews');
exports.createNewTour = factory.createOne(tourModel, 'Tour');
exports.updateTour = factory.updateOne(tourModel, 'Tour');
exports.deleteTour = factory.deleteOne(tourModel, 'Tour');

exports.tourStats = catchAsync(async (req, res, next) => {
  const stats = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'easy' } },
    },
  ]);

  res.status(200).json({
    data: stats,
  });
});
exports.getBusiestMonth = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  console.log(year);
  //see unwind is used to create documents out of the elements in the array alright yeah
  //and then we have the match to get what all to show
  //group id is used to make collections
  //$month is an aggregation operator used to get the month
  //in the same group, we count the number of tours
  //and add the names in the array using push operator alright yeah
  const busiestMonth = await tourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberOfTours: { $sum: 1 },
        nameOfTours: { $push: '$name' },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: busiestMonth,
  });
});
