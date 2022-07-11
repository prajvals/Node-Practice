const express = require('express');
const reviewController = require('./../Controllers/ReviewController');
const reviewRouter = express.Router({
  mergeParams: true,
}); // this is to get the params from routers
const authController = require('./../Controllers/authController');

reviewRouter.use(authController.protectRoute);

reviewRouter
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setIds,
    reviewController.createNewReview
  );

reviewRouter
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .get(reviewController.getReview);

module.exports = reviewRouter;
