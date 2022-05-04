const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
process.on('unhandledException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
//these are all the errors which happen in synchronous code but are not caught
//also all asynchronous code errors will be caught in the global error handler we made using express

//we have to make this function at the top so that it is able to catch all the errors in it alright yeah

const app = require('./app2');
// const portNumber = 4008;
// app.use(dot)

// console.log(process.env);
const DB = process.env.DATABASE;
let dbAddressWithPassword = DB.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(dbAddressWithPassword);
mongoose
  .connect(dbAddressWithPassword, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    // console.log(connection);
    console.log('db connected successfully');
  });

const portNumber = process.env.PORT;
const server = app.listen(portNumber, () => {
  console.log('Yeah we are live');
});

//this is to access globally all the errors which are not because of express like database connection errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
