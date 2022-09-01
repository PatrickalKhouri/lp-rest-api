const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userAddressService, tokenService } = require('../services');

const createUserAddress = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const user = await tokenService.getUserFromToken(token);
  if (user.role !== 'admin') {
    if (req.body.userId !== String(user._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create a user address for another user');
    } else {
      const userAddress = await userAddressService.createUserAddress(req.body);
      res.status(httpStatus.CREATED).send(userAddress);
    }
  } else {
    const userAddress = await userAddressService.createUserAddress(req.body);
    res.status(httpStatus.CREATED).send(userAddress);
  }
});

const getUserAddresses = catchAsync(async (req, res) => {
  res.status(req);
});

const getUserAddress = catchAsync(async (req, res) => {
  res.status(req);
});

const updateUserAddress = catchAsync(async (req, res) => {
  res.status(req);
});

const deleteUserAddress = catchAsync(async (req, res) => {
  res.status(req);
});

module.exports = {
  createUserAddress,
  getUserAddresses,
  getUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
