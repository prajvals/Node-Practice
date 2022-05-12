const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const express = require('express');
const mongoose = require('mongoose');
const { json } = require('express/lib/response');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./Routes/TourRouter');
const userRouter = require('./Routes/UserRouter');
const globalErrorObject = require('./Utils/AppError');
const globalErrorHandler = require('./Controllers/AppErrorController');

console.clear(); //only for clearing terminal in nodemon

//setting security headers
app.use(helmet());

//rateLimiting
const limitRate = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests, please try again after one hour',
});
app.use('/api', limitRate);

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//the difference between app.use and app.all is that
//app.use is used for middlewares
//app.all is used for routeHandlers
//app.all does exact route matching alright yeah
//app.all can filter different types of requests and can send such responses alright yeah
//app.all is used to capture all the verbs

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Failure',
  //   message: `${req.originalUrl} is not a valid Path`,
  // });
  // const err = new Error(`cant find a particular route`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new globalErrorObject("Can't find this particular route", 404));
});

app.use(globalErrorHandler);

module.exports = app;


/*
see helmet is for setting security headers which browsers understand and will incorporate on it alright yeah 
ratelimiting is to limit the number of requests that a particular ip address can make in a particular time span
ratelimiting is applied on a particular route and it keeps tracks of all the requests coming to that route
also setting the limit in json parser is where we can specify till what size are body allowed in here

*/