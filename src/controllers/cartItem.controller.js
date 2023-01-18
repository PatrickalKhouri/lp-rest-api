/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartItemService, tokenService, albumService, userService, shoppingSessionService } = require('../services');

const createCartItem = catchAsync(async (req, res) => {
  const { shoppingSessionId, albumId } = req.body;
  const shoppingSession = shoppingSessionService.getShoppingSessionById(shoppingSessionId);
  if (!shoppingSession) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't crete item cart for non existing shopping session");
  }
  const album = albumService.getAlbumById(albumId);
  if (!album) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't crete item cart for non existing album");
  }
  const shoppingSessionUserId = userService.getUserById(shoppingSession.userId);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(shoppingSessionUserId._id) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create a cart Item for another user');
    } else {
      try {
        const cartItem = await cartItemService.createCartItem(req.body);
        res.status(httpStatus.CREATED).send(cartItem);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating cart item');
      }
    }
  } else {
    try {
      const cartItem = await cartItemService.createCartItem(req.body);
      res.status(httpStatus.CREATED).send(cartItem);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating cart item');
    }
  }
});

const getCartItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['shoppingSessionId', 'albumId', 'quantity']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await cartItemService.queryCartItems(filter, options);
    res.send(result);
  } else if (!filter.shoppingSessionId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all user payments');
  } else {
    const shoppingSession = await shoppingSessionService.getShoppingSessionById(filter.shoppingSessionId);
    if (String(currentUser._id) === String(shoppingSession.userId)) {
      const result = await cartItemService.queryCartItems(filter, options);
      res.send(result);
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your own cart items');
    }
  }
});

const getCartItem = catchAsync(async (req, res) => {
  const cartItem = await cartItemService.getCartItemById(req.params.cartItemId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Item not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    const shoppingSession = await shoppingSessionService.getShoppingSessionById(String(cartItem.shoppingSessionId));
    if (String(shoppingSession.userId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get a cart item of another user');
    } else {
      res.send(cartItem);
    }
  } else {
    res.send(cartItem);
  }
});

const updateCartItem = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.shoppingSessionId) {
    const shoppingSession = await shoppingSessionService.getShoppingSessionById(req.body.shoppingSessionId);
    if (!shoppingSession) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shpping Session to update not found');
    }
    if (!shoppingSession.userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Can't update item cart for non existing user");
    }
  }
  if (req.body.albumId) {
    const album = await albumService.getAlbumById(req.body.albumId);
    if (!album) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Album to update not found');
    }
  }
  const cartItemToUpdate = await cartItemService.getCartItemById(req.params.cartItemId);
  const cartItemShoppingSession = await shoppingSessionService.getShoppingSessionById(
    String(cartItemToUpdate.shoppingSessionId)
  );
  const shoppingSessionUser = await userService.getUserById(cartItemShoppingSession.userId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(shoppingSessionUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update a cart item for another user');
    } else {
      try {
        const cartItem = await cartItemService.updateCartItemById(req.params.cartItemId, req.body);
        res.send(cartItem);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating cart item');
      }
    }
  } else {
    try {
      const cartItem = await cartItemService.updateCartItemById(req.params.cartItemId, req.body);
      res.send(cartItem);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating cart item');
    }
  }
});

const deleteCartItem = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const cartItemToDelete = await cartItemService.getCartItemById(req.params.cartItemId);
  if (currentUser.role !== 'admin') {
    const cartItemShoppingSession = await shoppingSessionService.getShoppingSessionById(
      String(cartItemToDelete.shoppingSessionId)
    );
    if (String(currentUser._id) !== String(cartItemShoppingSession.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete a cart item for another user');
    } else {
      await cartItemService.deleteCartItemById(req.params.cartItemId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await cartItemService.deleteCartItemById(req.params.cartItemId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createCartItem,
  getCartItems,
  getCartItem,
  updateCartItem,
  deleteCartItem,
};
