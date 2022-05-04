const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
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
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(err, res);
  }
};

module.exports = errorHandler;
