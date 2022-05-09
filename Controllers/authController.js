const { promisify } = require('util');
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
    role: req.body.role,
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
    return next(new globalErrorObject('Incorrect Password/Username', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    result: 'Success',
    token,
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new globalErrorObject('You are not authorized to access this', 401)
    );
  }

  //see not all callbacks are promises alright yeah
  //the only callbacks which are promises are those in which we are returning a promise and calling resolve inside it refer your async js notes for more on it
  //the decoded object is basically the payload inside the json web token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('element');
  console.log(decoded);

  // check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new globalErrorObject('The User for which this token exsists has expired')
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      globalErrorObject('User recently changed password, please login again')
    );
  }

  req.user = freshUser;
  next();
});

//we could have worked without the use of returning of the main function too, but we needed it for the req, res and the next function alright yeah
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new globalErrorObject(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
};


/*
see forgot password is basically like, we get the userEmail as the input, we find which user is requesting it, and then we create a randomString, and we provide for how many characters that should be and how it should be like, we make it a string of hex so that its a bit difficult to understand
we have to store in the db too,but directly storing it would be letting a security vulnerability inside it alright yeah
so instead of that, we encrypt it and then save while we send back the token
*/
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new globalErrorObject('No accounts with this id found', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
});
/*
see the global error handler is the function we have created in the error Controller
its responsible for sending the error responses
the global error object is responsible for defining and creating the error object
its this error object which is passed to the error controller
for passing it to the error controller we need to send it in next(errorObject)
*/
