/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userPaymentService, tokenService, userService } = require('../services');

const createUserPayment = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create payment for non existing user");
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (userId !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create a user Payment for another user');
    } else {
      try {
        const userPayment = await userPaymentService.createUserPayment(req.body);
        res.status(httpStatus.CREATED).send(userPayment);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user Payment');
      }
    }
  } else {
    try {
      const userPayment = await userPaymentService.createUserPayment(req.body);
      res.status(httpStatus.CREATED).send(userPayment);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user Payment');
    }
  }
});

const getUserPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'accountNumber', 'paymentType', 'provider']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await userPaymentService.queryUserPayments(filter, options);
    res.send(result);
  } else if (!filter.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all user payments');
  } else if (String(filter.userId) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your own payments');
  } else {
    const result = await userPaymentService.queryUserPayments(filter, options);
    res.send(result);
  }
});

const getUserPayment = catchAsync(async (req, res) => {
  const userPayment = await userPaymentService.getUserPaymentById(req.params.userPaymentId);
  if (!userPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Payment not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(userPayment.userId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get a user Payment of another user');
    } else {
      res.send(userPayment);
    }
  } else {
    res.send(userPayment);
  }
});

const updateUserPayment = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.userId) {
    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to update not found');
    }
  }
  const userPaymentToUpdate = await userPaymentService.getUserPaymentById(req.params.userPaymentId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(userPaymentToUpdate.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update a user Payment for another user');
    } else {
      try {
        const userPayment = await userPaymentService.updateUserPaymentById(req.params.userPaymentId, req.body);
        res.send(userPayment);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating user Payment');
      }
    }
  } else {
    try {
      const userPayment = await userPaymentService.updateUserPaymentById(req.params.userPaymentId, req.body);
      res.send(userPayment);
    } catch (e) {
      console.log('oi');
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user Payment');
    }
  }
});

const deleteUserPayment = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const userPayment = await userPaymentService.getUserPaymentById(req.params.userPaymentId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(userPayment.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete a user Payment for another user');
    } else {
      await userPaymentService.deleteUserPaymentById(req.params.userPaymentId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await userPaymentService.deleteUserPaymentById(req.params.userPaymentId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createUserPayment,
  getUserPayments,
  getUserPayment,
  updateUserPayment,
  deleteUserPayment,
};
