const fs = require('fs');
const tourModel = require('../../Models/TourModel');
const reviewModel = require('../../Models/ReviewModel');
const userModel = require('../../Models/userModel');

const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

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
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log('executed');
    console.log('db connected successfully');

    if (process.argv[2] === 'insert') {
      insertAllDocuments();
    } else if (process.argv[2] === 'delete') {
      deleteDocument();
    }
  })
  .catch((err) => {
    console.log('error occurred');
    console.log(err);
  });

//./ represents the place where from the node application has been started alright yeah yup
//and so if we need the relative path to a particular place we use the __dirname for it alright yeah

const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const reviewData = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const userData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const deleteDocument = async () => {
  console.log(tourModel);
  await tourModel.deleteMany();
  await reviewModel.deleteMany();
  await userModel.deleteMany();
};

const insertAllDocuments = async () => {
  await tourModel.create(tourData);
  await reviewModel.create(reviewData);
  await userModel.create(userData, { validateBeforeSave: false });
};

// tourModel.deleteMany();
console.log(process.argv);
// process.exit();
