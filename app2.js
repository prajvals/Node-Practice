const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitise = require('express-mongo-sanitize');
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
const reviewRouter = require('./Routes/ReviewRouter');
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

//body parser
app.use(express.json({ limit: '10kb' }));

//to prevent NoSQL query injections
app.use(mongoSanitise());

//to prevent cross site scripting attacks
app.use(xss());

//to prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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

//when we send next(withAnyParameter inside), its considered as an error, and its handled by the default error handler, but we can handle it ourselves by creating an error handler ourselves
//this error handler is actually just a middleware with 4 parameters
app.use(globalErrorHandler);

module.exports = app;

/*
see helmet is for setting security headers which browsers understand and will incorporate on it alright yeah 
ratelimiting is to limit the number of requests that a particular ip address can make in a particular time span
ratelimiting is applied on a particular route and it keeps tracks of all the requests coming to that route
also setting the limit in json parser is where we can specify till what size are body allowed in here
noSql query injection run by providing a query instead of a value and then even with only a password or only a particular value they are able to gain access to the system, this is prevented by removing all the $ and mongo operators so as to control the flow of the application alright yeah
xss() is used to remove any html code, becaus with html code they can embed some javascript code and that will be run on our servers and give them access, this is called as the cross site scripting attack
this is prevented by changing the html into some symbols so that the html along with their embeded javascript code could not be executed alright 
parameter pollution is that we have the code at multiple places written to handle only one parameter alright
but the user can send multiple parameters in which case our code throws an error 
so using this hpp() we select only the latest one as the parameter and present result according to it 
but besides this too we can specify extra parameters and this we can do by using whitelisting the parameters we need to have duplicates with alright yeah
*/
