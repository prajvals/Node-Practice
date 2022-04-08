const tourModel = require('./../Models/TourModel');

//ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  // tourModel.find((res) => {
  //   res.status(200).json({
  //     status: 'Success',
  //     size: res.size,
  //     data: res,
  //   });
  // });
};

exports.getParticularTour = (req, res) => {
  req.params.id = req.params.id * 1;
  console.log(req.params);
  let particularTour;
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
  res.status(200).json({
    particularTour,
  });
};

exports.createNewTour = async (req, res) => {
  const contents = req.body;
  try {
    const newTour = await tourModel.create(contents);

    res.status(200).json({
      status: 'Success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Please Send proper data',
    });
  }
};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
