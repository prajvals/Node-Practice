const express = require('express');
const router = express.Router();
const tourController = require('./../Controllers/tourControllers');
const authController = require('./../Controllers/authController');
// const reviewController = require('./../Controllers/ReviewController');
const reviewRouter = require('./ReviewRouter');

// router.param('id', tourController.checkId);

// router.use((req, res, next) => {
//   console.log('Yes');
//   next();
// });
router.use('/:id/reviews', reviewRouter); //here we mounted another router on top of this router

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
  .delete(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )
  .get(tourController.getParticularTour);

// router
//   .route('/:id/reviews')
//   .post(
//     authController.protectRoute,
//     authController.restrictTo('user'),
//     reviewController.createNewReview
//   )
//   .get(reviewController.getAllReviews);
/*
  Nested routes are used so that the user doesnt need to provide all data in its body, the data in these is picked up from the user logged in and the tour he is viewing 
  */
module.exports = router;
