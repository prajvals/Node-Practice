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
