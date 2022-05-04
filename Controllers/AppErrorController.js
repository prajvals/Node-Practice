const AppError = require('./../Utils/AppError');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastError = (error) => {
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateIdError = (err) => {
  const message = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new AppError(`The id is duplicate for ${message}`, 400);
  // console.log(message);
};

const ValidationError = (err) => {
  const arrayOfErrors = Object.values (err.errors).map((el) => el.message);
  const message = arrayOfErrors.join('. ');
  return new AppError(message, 400);
};

const sendProdError = (err, res) => {
  if (err.isOperational === false) {
    res.status(err.statusCode).json({
      status: 500,
      message: 'Some Error Occurred',
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
    });
  }
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err);
    let error = { ...err };
    console.log(error.name);
    if (err.name === 'CastError') {
      //this is to get invalid id error alright yeah
      //interestingly, error.name is coming as undefined,whenever you get time check this out
      error = handleCastError(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateIdError(err);
    }
    if (err.name === 'ValidationError') {
      error = ValidationError(err);
    }
    sendProdError(error, res);
  }
};

module.exports = errorHandler;
