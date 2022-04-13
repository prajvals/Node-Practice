const express = require('express');
const router = express.Router();
const tourController = require('./../Controllers/tourControllers');

// router.param('id', tourController.checkId);

router.use((req, res, next) => {
  console.log('Yes');
  next();
});

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
  .route('/')
  .post(tourController.createNewTour)
  .get(tourController.getAllTours);
router
  .route('/:id')
  .put(tourController.updateTour)
  .delete(tourController.deleteTour)
  .get(tourController.getParticularTour);

module.exports = router;
