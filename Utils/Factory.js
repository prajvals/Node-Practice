const catchAsync = require('./catchAsync');
const AppError = require('./AppError');

exports.deleteOne = (Model, nameOfModel) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(new AppError(`No ${nameOfModel} found with this record`));
    }
    res.status(204).json({
      status: 'Success',
    });
  });
exports.updateOne = (Model, nameOfModel) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return next(AppError(`No ${nameOfModel} found with this record`));
    }

    res.status(200).json({});
  });
exports.createOne = (Model, nameOfModel) =>
  catchAsync(async (req, res, next) => {
    const contents = req.body;
    const data = await Model.create(contents);
    //create is very similar to save, but its like it runs save for a collection of documents and saves them, you can use it with just one doc too

    res.status(200).json({
      status: 'Success',
      data,
    });

    //see what it returns in async await is what it passes as the response data in
    //.then() alright
  });
exports.getOne = (Model, nameOfModel, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const data = await query;
    //note: this is for handling the error that we were returning null
    //but if there is really a validation error or similar to this
    //there would be a mongo db error that would be caught by the global error handling
    //functions alright yeah
    if (!data) {
      return next(new AppError(`No ${nameOfModel} found with this record`));
    }
    console.log(data);
    res.status(200).json({
      data,
    });
    // res.status((data) => {
    //   res.status(200).json({
    //     data,
    //   });
    // });

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
