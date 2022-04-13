const tourModel = require('./../Models/TourModel');

//ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  tourModel.find().then((data) => {
    res.status(200).json({
      status: 'Success',
      size: data.size,
      data: {
        data,
      },
    });
  });
  // tourModel.find((res) => {
  //   res.status(200).json({
  //     status: 'Success',
  //     size: res.size,
  //     data: res,
  //   });
  // });
};

exports.getParticularTour = (req, res) => {
  req.params.id 
  console.log(req.params.id);
  tourModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({
        status: 'fail',
        message: 'Improper request',
      });
    });
  // console.log(req.params);
  // let particularTour;
  // console.log(tourList);
  // particularTour = tourList.find((element) => element.id === req.params.id);
  // // for (const element of tourList) {
  //   if (element.id === req.params.id) {
  //     console.log(element.id);
  //     console.log(element);
  //     particularTour = element;
  //     break;
  //   }
  // }
};

exports.createNewTour = async (req, res) => {
  const contents = req.body;
  tourModel
    .create(contents)
    .then((data) => {
      res.status(200).json({
        status: 'Success',
        data: {
          data,
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    });
  // try {
  //   const newTour = await tourModel.create(contents);
  //   res.status(200).json({
  //     status: 'Success',
  //     data: {
  //       newTour,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Please Send proper data',
  //   });
  // }

  //see what it returns in async await is what it passes as the response data in
  //.then() alright
};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
