const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }, '-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id: userID } = req.params;

  const user = await User.findOne({ _id: userID }, '-password');
  if (!user) {
    CustomError.NotFoundError(`No user with id ${userID}`);
  }
  checkPermissions(req.user, userID);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(StatusCodes.OK).json({ user });
};

// update user with user.save()
const updateUser = async (req, res) => {
  const {
    body: { name, email },
    user: { userID },
  } = req;

  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: userID });
  user.name = name;
  user.email = email;
  await user.save();

  const tokenUser = createTokenUser({ user });
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword },
    user: { userID },
  } = req;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide old password and new password'
    );
  }

  const user = await User.findOne({ _id: userID });
  const isPasswordMatch = await user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ message: 'Password changed' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const {
//     body: { name, email },
//     user: { userID },
//   } = req;

//   if (!name || !email) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: userID },
//     { name, email },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser({ user });
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
