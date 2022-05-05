const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const globalErrorObject = require('./../Utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    result: 'Success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new globalErrorObject('Please Enter Email and Password', 400));

    //see both the approaches are right here

    // return res.status(400).json({
    //   result: 'Fail',
    //   message: ' Please enter Email and Password',
    // });
  }

  //see here we are using findOne instead of findById because here we are not using id to identify the element alright yeah
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new globalErrorObject('Incorrect Password/Username', 400));
  }

  const token = signToken(user._id);
  res.status(200).json({
    result: 'Success',
    token,
  });
});

/*
see the global error handler is the function we have created in the error Controller
its responsible for sending the error responses
the global error object is responsible for defining and creating the error object
its this error object which is passed to the error controller
for passing it to the error controller we need to send it in next(errorObject)
*/
