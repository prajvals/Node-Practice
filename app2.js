const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();
const tourRouter = require('./Routes/TourRouter');
const userRouter = require('./Routes/UserRouter');

console.clear();

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
