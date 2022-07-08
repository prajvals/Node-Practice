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


exports.updateOne = (Model,nameOfModel) => catchAsync(async (req, res, next) => {
  const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(AppError(`No ${nameOfModel} found with this record`));
  }

  res.status(200).json({
    data,
  });
});