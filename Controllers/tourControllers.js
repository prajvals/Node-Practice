const tourModel = require('./../Models/TourModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/AppError');

exports.Aliasing = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

//ROUTE HANDLERS
exports.getAllTours = catchAsync(async (req, res, next) => {
  // const featureObject = new ApiFeatures(tourModel.find(), req.query)
  // .filter()
  // .paginate()
  // .fieldLimiting()
  // .sort();

  // console.log(featureObject);

  // console.log(featureObject.query);
  // const tourData = await featureObject.query;

  const tourData = await tourModel.find();
  // console.log(tourData);
  res.status(200).json({
    status: 'Success',
    size: tourData.size,
    data: {
      tourData,
    },
  });
});

exports.getParticularTour = catchAsync(async (req, res, next) => {
  const data = await tourModel.findById(req.params.id);

  //note: this is for handling the error that we were returning null
  //but if there is really a validation error or similar to this
  //there would be a mongo db error that would be caught by the global error handling
  //functions alright yeah
  if (!data) {
    return next(AppError('No tour found with this record'));
  }
  res.status((data) => {
    res.status(200).json({
      data,
    });
  });

  // .then((data) => {
  //   res.status(200).json({
  //     data,
  //   });
  // })

  // .catch((err) => {
  //   console.log(err);
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Improper request',
  //   });
  // });

  // console.log(req.params);
  // let particularTour;
  // console.log(tourList);
  // particularTour = tourList.find((element) => element.id === req.params.id);
  // // for (const element of tourList) {
  //   if (element.id === req.params.id) {
  //     console.log(element.id);
  //     console.log(element);
  //     particularTour = element;
  //     break;
  //   }
  // }
});

/*
okay this needs a lil bit of more attention 
1. see when we are creating a global exception handler, we want to pass all the exceptions to it only right 
2. when we use async await, the exception handling is done using the try catch block
3. which leads to repeated code everytime and violates the principle of handling errors in one central place alright yeah 
4. now important thing here is when we use catch async, we are passing a function to it
5. this is the original function we want to execute alright 
6. but executing the function will return us the object/promise
7. while the router expects this routeHandler to actually have a function assigned to it which it can run to return a response
8. when we wrap the function inside the catchAsync and actually return the function
9. then its returning an object/promise alright yeah
10. so instead of calling the main function inside the catchAsync we return one function from it 
11. and its this function which is run by the express, and hence it gets the req,res,next objects which we pass to our main function
12. our main function being a async function returns a promise which we can use to catch errors
13.now the catch having the next is basically because the catch passes the error object into its function right, this function is usually the one we create alright yeah
14. so here if we are passing next, then this function is getting the next object into it already
*/

exports.createNewTour = catchAsync(async (req, res, next) => {
  const contents = req.body;
  const data = await tourModel.create(contents);
  //create is very similar to save, but its like it runs save for a collection of documents and saves them, you can use it with just one doc too

  res.status(200).json({
    status: 'Success',
    data,
  });
  // .then((data) => {
  //   res.status(200).json({
  //     status: 'Success',
  //     data: {
  //       data,
  //     },
  //   });
  // })
  // .catch((err) => {
  //   res.status(200).json({
  //     status: 'fail',
  //     message: 'Something went wrong',
  //   });
  // });
  // try {
  //   const newTour = await tourModel.create(contents);
  //   res.status(200).json({
  //     status: 'Success',
  //     data: {
  //       newTour,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Please Send proper data',
  //   });
  // }

  //see what it returns in async await is what it passes as the response data in
  //.then() alright
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const data = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(AppError('No tour found with this record'));
  }

  res.status(200).json({
    data,
  });
  // .then((data) => {
  //   res.status(200).json({
  //     data,
  //   });
  // })
  // .catch((err) => {
  //   console.log('Err occured');
  //   console.log(err);
  //   res.status(400).json({
  //     err,
  //   });
  // });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const data = await tourModel.findByIdAndDelete(req.params.id);

  if (!data) {
    return next(AppError('No tour found with this record'));
  }
  res.status(204).json({
    status: 'Success',
    // data,
  });
  // .then((data) => {
  //   res.status(204).json({
  //     data: null,
  //   });
  // })
  // .catch((err) => {
  //   res.status(400).json({
  //     err,
  //   });
  // });
});

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
