const express = require('express');
const userRouter = express.Router();

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'this route is not yet implemented',
  });
};
const createNewUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'this route is not yet implemented',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'this route is not yet implemented',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'this route is not yet implemented',
  });
};

userRouter.route('/').get(getAllUsers).post(createNewUser);
userRouter.route('/:id').put(updateUser).delete(deleteUser);

module.exports = userRouter;
