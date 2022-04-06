const express = require('express');
const router = express.Router();
const tourController = require('./../Controllers/tourControllers');

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
