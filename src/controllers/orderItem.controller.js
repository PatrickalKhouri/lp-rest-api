/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService, orderDetailService, albumService, tokenService, userService } = require('../services');

const createOrderItem = catchAsync(async (req, res) => {
  const { albumId, orderDetailId } = req.body;
  const album = await albumService.getAlbumById(albumId);
  if (!album) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create order item for non existing album");
  }
  const orderDetail = await orderDetailService.getOrderDetailById(orderDetailId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create order item for non existing order detail");
  }
  const orderDetailUserId = await userService.getUserById(orderDetail.userId);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(orderDetailUserId._id) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create an order item for another user');
    } else {
      try {
        const orderItem = await orderItemService.createOrderItem(req.body);
        res.status(httpStatus.CREATED).send(orderItem);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating order item');
      }
    }
  } else {
    try {
      const orderItem = await orderItemService.createOrderItem(req.body);
      res.status(httpStatus.CREATED).send(orderItem);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating order item');
    }
  }
});

const getOrderItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['albumId', 'orderDetailId', 'quantity']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await orderItemService.queryOrderItems(filter, options);
    res.send(result);
  } else if (!filter.orderDetailId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all order items');
  } else {
    const orderDetail = await orderDetailService.getOrderDetailById(filter.orderDetailId);
    const orderDetailUserId = orderDetail.userId;
    if (String(currentUser._id) === String(orderDetailUserId)) {
      const result = await orderItemService.queryOrderItems(filter, options);
      res.send(result);
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your own order items');
    }
  }
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    const orderDetail = await orderDetailService.getOrderDetailById(String(orderItem.orderDetailId));
    const orderDetailUserId = orderDetail.userId;
    if (String(orderDetailUserId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get an order item of another user');
    } else {
      res.send(orderItem);
    }
  } else {
    res.send(orderItem);
  }
});

const updateOrderItem = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.orderDetailId) {
    const orderDetail = await orderDetailService.getorderDetailById(req.body.orderDetailId);
    if (!orderDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Detail to update not found');
    }
    const orderDetailUserId = orderDetail.userId;
    if (!orderDetailUserId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Can't update order item for non existing user");
    }
  }
  if (req.body.albumId) {
    const album = await albumService.getAlbumById(req.body.albumId);
    if (!album) {
      throw new ApiError(httpStatus.NOT_FOUND, "Can't update order item for non existing album");
    }
  }
  const orderItemToUpdate = await orderItemService.getOrderItemById(req.params.orderItemId);
  const orderItemOrderDetail = await orderDetailService.getOrderDetailById(String(orderItemToUpdate.orderDetailId));
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(orderItemOrderDetail.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update an order item for another user');
    } else {
      try {
        const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);
        res.send(orderItem);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating order item');
      }
    }
  } else {
    try {
      const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);
      res.send(orderItem);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating order item');
    }
  }
});

const deleteOrderItem = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    const orderItemToDelete = await orderItemService.getOrderItemById(req.params.orderItemId);
    const orderItemOrderDetail = await orderDetailService.getOrderDetailById(String(orderItemToDelete.orderDetailId));
    if (String(currentUser._id) !== String(orderItemOrderDetail.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete a order item for another user');
    } else {
      await orderItemService.deleteOrderItemById(req.params.orderItemId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await orderItemService.deleteOrderItemById(req.params.orderItemId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createOrderItem,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
