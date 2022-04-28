const express = require('express');
const mongoose = require('mongoose');
const { json } = require('express/lib/response');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./Routes/TourRouter');
const userRouter = require('./Routes/UserRouter');
const AppError = require('./Utils/AppError');
const AppErrorController = require('./Controllers/AppErrorController');

console.clear();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//the difference between app.use and app.all is that
//app.use is used for middlewares
//app.all is used for routeHandlers
//app.all does exact route matching alright yeah
//app.all can filter different types of requests and can send such responses alright yeah

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Failure',
  //   message: `${req.originalUrl} is not a valid Path`,
  // });
  // const err = new Error(`cant find a particular route`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError("Can't find this particular route", 404));
});

app.use(AppErrorController);
module.exports = app;


//this is to make it dirty and check 