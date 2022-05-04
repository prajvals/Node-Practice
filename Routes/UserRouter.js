const express = require('express');
const userRouter = express.Router();
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

userRouter.post('/signup', authController.signup);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
userRouter
  .route('/:id')
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
