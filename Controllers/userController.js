const User = require('./../Models/userModel');
const globalErrorObject = require('./../Utils/AppError');
const catchAsync = require('./../Utils/catchAsync');
const factory = require('./../Utils/Factory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updatePresentUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new globalErrorObject(
        'Password cannot be changed, use /updatePassword',
        401
      )
    );
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new globalErrorObject('User does not exist', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true,
  });
  return res.status(201).json({
    status: 'Success',
    updatedUser,
  });
  // next();
});

exports.deletePresentUser = async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  // user.active = false;
  // user.save();
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: user,
  });
};

exports.getAllUsers = factory.getAll(User, 'User');

//this is just for testing, the right method is to use signup router
exports.createNewUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  const newUser = await User.create(data);

  if (!newUser) {
    next(new globalErrorObject());
  }
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.deleteUser = factory.deleteOne(User, 'User');
exports.updateUser = factory.updateOne(User, 'User');
exports.getUser = factory.getOne(User, 'User');
