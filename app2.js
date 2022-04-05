const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');
const app = express();
const tourRouter = require('./Routes/TourRouter');
const userRouter = require('./Routes/UserRouter');

console.clear();
const portNumber = 4008;

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
