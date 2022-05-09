const express = require('express');
const router = express.Router();
const tourController = require('./../Controllers/tourControllers');
const authController = require('./../Controllers/authController');

// router.param('id', tourController.checkId);

// router.use((req, res, next) => {
//   console.log('Yes');
//   next();
// });

router.use('/v1', (req, res, next) => {
  console.log('Just to check ');
  next();
});

const checkdata = (req, res, next) => {
  if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('price')) {
    console.log('Yes condition satisfied');
    next();
  } else {
    return res.status(400).json({
      status: 'Failed',
      message: 'Name or Price is missing',
    });
  }
};

router
  .route('/cheap-5-tours')
  .get(tourController.Aliasing, tourController.getAllTours);

/*see the only thing that is different about this middleware is that
  it will only run when the path matches
  and only when its for the get method
  we can have middlewares with use, which run for all the requests alright yeah
  and we can have middlewares which run for only a specified path too alright yeah
  */

router
  .route('/')
  .post(tourController.createNewTour)
  .get(authController.protectRoute, tourController.getAllTours);

router.route('/stats').get(tourController.tourStats);

router.route('/busy-Month/:year').get(tourController.getBusiestMonth);

router
  .route('/:id')
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)
  .get(tourController.getParticularTour);

module.exports = router;
