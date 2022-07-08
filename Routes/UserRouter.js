const express = require('express');
const userRouter = express.Router();
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

userRouter.post('/login', authController.login);
userRouter.post('/signup', authController.signup);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch(
  '/updatePassword',
  authController.protectRoute,
  authController.updatePassword
);

userRouter.post(
  '/updatePresentUser',
  authController.protectRoute,
  userController.updatePresentUser
);

userRouter.delete(
  '/deletePresentUser',
  authController.protectRoute,
  userController.deletePresentUser
);

userRouter.delete(
  '/:id',
  authController.protectRoute,
  authController.restrictTo('admin'),
  userController.deleteUser
);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
