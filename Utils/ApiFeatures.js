const tourModel = require('./../Models/TourModel');
class ApiFeatures {
  //see query string is basically the req.query object alright
  //query is the obect created by tour.find() which is one of the mongose methods
  //on these mongose methods sort,select,skip,limit are available
  //and the filter function is nothing but calling find method with some parameters
  //here we are building the query object and then using that object we are making query, by awaiting it

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];

    //2. Filtering for keywords
    excludedFields.forEach((el) => {
      delete queryObject[el];
    });

    //3. filtering for mongo keywords
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
      return `$${match}`;
    });

    //apprently we cannot store a promise in a variable
    let query = tourModel.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('duration');
    }
    return this;
  }

  fieldLimiting() {
    if (this.query.fields) {
      const field = this.queryString.fields.split('.').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
