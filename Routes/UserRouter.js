const express = require('express');
const userRouter = express.Router();
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

userRouter.post('/login', authController.login);
userRouter.post('/signup', authController.signup);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protectRoute); //to allow only the logged in users for all the routes that follow ie written below

userRouter.patch(
  '/updatePassword',
  authController.updatePassword
);

userRouter.post(
  '/updatePresentUser',
  userController.updatePresentUser
);

userRouter.delete(
  '/deletePresentUser',
  userController.deletePresentUser
);

userRouter.use(authController.restrictTo('admin')) //to restrict the routes to only the admin for all the routes that go below

userRouter.delete(
  '/:id',
  userController.deleteUser
);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

userRouter.get(
  '/me',
  userController.getMe,
  userController.getUser
);

userRouter
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser);

module.exports = userRouter;
