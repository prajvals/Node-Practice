const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const globalErrorObject = require('./../Utils/AppError');
const sendEmail = require('../Utils/email.js');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req);
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new globalErrorObject('This user does not exist', 404));
  }
  if (!(await user.checkPassword(req.body.password, user.password))) {
    return next(
      new globalErrorObject('Password entered is wrong, please try again', 404)
    );
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  sendToken(user, 200, res);
  next();
});

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.environment === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
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

  sendToken(newUser, 201, res);
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
  sendToken(user, 200, res);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
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
      new globalErrorObject(
        'User recently changed password, please login again'
      )
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

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    });
    return res.status(200).json({
      status: 'Success',
      message: 'reset token sent to email',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new globalErrorObject(
        'Some error occured while sending email, please try again',
        500
      )
    );
  }
  return next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new globalErrorObject('Token is invalid or expired', 500));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, 200, res);

  next();
});
/*
see the global error handler is the function we have created in the error Controller
its responsible for sending the error responses
the global error object is responsible for defining and creating the error object
its this error object which is passed to the error controller
for passing it to the error controller we need to send it in next(errorObject)
*/
