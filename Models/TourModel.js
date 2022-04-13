const mongoose = require('mongoose');

//you can send any other data apart from what is defined in the schema
//but only what is defined in the schema would be the one taken up
//rest will be discarded
//also if there are validation errors which come when a required value is missing
//of the unique property is not satisfied, then we will have errors too
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour should have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.7,
  },
  price: {
    type: Number,
    required: [true, 'A tour should have a price'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
