/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userAddressService, tokenService, userService } = require('../services');

const createUserAddress = catchAsync(async (req, res) => {
  const bodyUserAddressUserId = req.body.userId;
  const user = await userService.getUserById(bodyUserAddressUserId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create address for non existing user");
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (req.body.userId !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create a user address for another user');
    } else {
      try {
        const userAddress = await userAddressService.createUserAddress(req.body);
        res.status(httpStatus.CREATED).send(userAddress);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user address');
      }
    }
  } else {
    try {
      const userAddress = await userAddressService.createUserAddress(req.body);
      res.status(httpStatus.CREATED).send(userAddress);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user address');
    }
  }
});

const getUserAddresses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'city', 'state', 'country']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await userAddressService.queryUserAddresses(filter, options);
    res.send(result);
  } else if (!filter.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all user addresses');
  } else if (String(filter.userId) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your own addresses');
  } else {
    const result = await userAddressService.queryUserAddresses(filter, options);
    res.send(result);
  }
});

const getUserAddress = catchAsync(async (req, res) => {
  const userAddress = await userAddressService.getUserAddressById(req.params.userAddressId);
  if (!userAddress) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(userAddress.userId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get a user address of another user');
    } else {
      res.send(userAddress);
    }
  } else {
    res.send(userAddress);
  }
});

const updateUserAddress = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.userId) {
    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to update not found');
    }
  }
  const userAddressToUpdate = await userAddressService.getUserAddressById(req.params.userAddressId);
  if (!userAddressToUpdate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(userAddressToUpdate.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update a user address for another user');
    } else {
      try {
        const userAddress = await userAddressService.updateUserAddressById(req.params.userAddressId, req.body);
        res.send(userAddress);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user address');
      }
    }
  } else {
    try {
      const userAddress = await userAddressService.updateUserAddressById(req.params.userAddressId, req.body);
      res.send(userAddress);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user address');
    }
  }
});

const deleteUserAddress = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const userAddressToDelete = await userAddressService.getUserAddressById(req.params.userAddressId);
  if (!userAddressToDelete) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(userAddressToDelete.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete a user address for another user');
    } else {
      await userAddressService.deleteUserAddressById(req.params.userAddressId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await userAddressService.deleteUserAddressById(req.params.userAddressId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createUserAddress,
  getUserAddresses,
  getUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
