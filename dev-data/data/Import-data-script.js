const fs = require('fs');
const tourModel = require('../../Models/TourModel');
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
  })
  .then((connection) => {
    console.log('db connected successfully');
  })
  .catch((err) => {
    console.log('error occurred');
  });

//./ represents the place where from the node application has been started alright yeah yup
//and so if we need the relative path to a particular place we use the __dirname for it alright yeah 

const dataRead = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const deleteDocument = () => {
  console.log(tourModel);
  tourModel
    .deleteMany()
    .then(() => {
      console.log('All records deleted');
    })
    .catch((err) => {
      console.log(err);
    });
};

const insertAllDocuments = () => {
  tourModel.create(dataRead).then(() => {
    console.log('data read');
  });
};
if (process.argv[2] === 'insert') {
  insertAllDocuments();
} else if (process.argv[2] === 'delete') {
  deleteDocument();
}

// tourModel.deleteMany();
console.log(process.argv);
// process.exit();
