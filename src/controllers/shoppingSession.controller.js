/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shoppingSessionService, tokenService, userService } = require('../services');

const createShoppingSession = catchAsync(async (req, res) => {
  const bodyShoppingSessionUserId = req.body.userId;
  const user = await userService.getUserById(bodyShoppingSessionUserId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create shopping session for non existing user");
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (req.body.userId !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create a shopping session for another user');
    } else {
      try {
        const shoppingSession = await shoppingSessionService.createShoppingSession(req.body);
        res.status(httpStatus.CREATED).send(shoppingSession);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating shopping session');
      }
    }
  } else {
    try {
      const shoppingSession = await shoppingSessionService.createShoppingSession(req.body);
      res.status(httpStatus.CREATED).send(shoppingSession);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating shopping session');
    }
  }
});

const getShoppingSessions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'total', 'createdAt', 'updatedAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await shoppingSessionService.queryShoppingSession(filter, options);
    res.send(result);
  } else if (!filter.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all shoppings sessions');
  } else if (String(filter.userId) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your shopping sessions');
  } else {
    console.log('oi');
    const result = await shoppingSessionService.queryShoppingSession(filter, options);
    res.send(result);
  }
});

const getShoppingSession = catchAsync(async (req, res) => {
  const shoppingSession = await shoppingSessionService.getShoppingSessionById(req.params.shoppingSessionId);
  if (!shoppingSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(shoppingSession.userId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get a user address of another user');
    } else {
      res.send(shoppingSession);
    }
  } else {
    res.send(shoppingSession);
  }
});

const updateShoppingSession = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.userId) {
    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to update not found');
    }
  }
  const shoppingSessionToUpdate = await shoppingSessionService.getShoppingSessionById(req.params.shoppingSessionId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(shoppingSessionToUpdate.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update a shopping session for another user');
    } else {
      try {
        const shoppingSession = await shoppingSessionService.updateShoppingSessionById(
          req.params.shoppingSessionId,
          req.body
        );
        res.send(shoppingSession);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating shopping session');
      }
    }
  } else {
    try {
      const shoppingSession = await shoppingSessionService.updateShoppingSessionById(req.params.shoppingSessionId, req.body);
      res.send(shoppingSession);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating shopping session');
    }
  }
});

const deleteShoppingSession = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const shoppingSessionToDelete = await shoppingSessionService.getShoppingSessionById(req.params.shoppingSessionId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(shoppingSessionToDelete.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete a user address for another user');
    } else {
      await shoppingSessionService.deleteShoppingSessionById(req.params.shoppingSessionId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await shoppingSessionService.deleteShoppingSessionById(req.params.shoppingSessionId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createShoppingSession,
  getShoppingSessions,
  getShoppingSession,
  updateShoppingSession,
  deleteShoppingSession,
};
