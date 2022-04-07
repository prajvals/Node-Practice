const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./Routes/TourRouter');
const userRouter = require('./Routes/UserRouter');

console.clear();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.send('2');
});

app.use('/', (req, res, next) => {
  console.log('Test');
  next();
});
app.get('/', (req, res) => {
  res.send('1');
});

module.exports = app;
