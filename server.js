const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
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
app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
