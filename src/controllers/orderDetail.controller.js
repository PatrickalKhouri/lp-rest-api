/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderDetailService, userPaymentService, tokenService, userService } = require('../services');

const createOrderDetail = catchAsync(async (req, res) => {
  const { userId, userPaymentId } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create order detail for non existing user");
  }
  const userPayment = await userPaymentService.getUserPaymentById(userPaymentId);
  if (!userPayment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create order detail for non existing user payment");
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (req.body.userId !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create an order detail for another user');
    } else {
      try {
        const orderDetail = await orderDetailService.createOrderDetail(req.body);
        res.status(httpStatus.CREATED).send(orderDetail);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating order detail');
      }
    }
  } else {
    try {
      const orderDetail = await orderDetailService.createOrderDetail(req.body);
      res.status(httpStatus.CREATED).send(orderDetail);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating user Payment');
    }
  }
});

const getOrderDetails = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'userPaymentId', 'total']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role === 'admin') {
    const result = await orderDetailService.queryOrderDetails(filter, options);
    res.send(result);
  } else if (!filter.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only admins can get all orders details');
  } else {
    const userPayment = await userPaymentService.getUserPaymentById(filter.userPaymentId);
    const userPaymentUserId = userPayment.userId;
    if (String(currentUser._id) === String(userPaymentUserId)) {
      const result = await orderDetailService.queryOrderDetails(filter, options);
      res.send(result);
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You can only get your own order detail');
    }
  }
});

const getOrderDetail = catchAsync(async (req, res) => {
  const orderDetail = await orderDetailService.getOrderDetailById(req.params.orderDetailId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Detail not found');
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (String(orderDetail.userId) !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to get an order of another user');
    } else {
      res.send(orderDetail);
    }
  } else {
    res.send(orderDetail);
  }
});

const updateOrderDetail = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.userId) {
    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to update not found');
    }
  }
  if (req.body.userPaymentId) {
    const userPayment = await userService.getUserById(req.body.userPaymentId);
    if (!userPayment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Payment to update not found');
    }
  }
  const orderDetailToUpdate = await orderDetailService.getOrderDetailById(req.params.orderDetailId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(orderDetailToUpdate.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update an order detail for another user');
    } else {
      try {
        const orderDetail = await orderDetailService.updateOrderDetailById(req.params.orderDetailId, req.body);
        res.send(orderDetail);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating order detail');
      }
    }
  } else {
    try {
      const orderDetail = await orderDetailService.updateOrderDetailById(req.params.orderDetailId, req.body);
      res.send(orderDetail);
    } catch (e) {
      console.log(e);
      console.log(req.params.orderDetailId);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when updating order detail');
    }
  }
});

const deleteOrderDetail = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const orderDetailToDelete = await orderDetailService.getOrderDetailById(req.params.orderDetailId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(orderDetailToDelete.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete an order detail for another user');
    } else {
      await orderDetailService.deleteOrderDetailById(req.params.orderDetailId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await orderDetailService.deleteOrderDetailById(req.params.orderDetailId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createOrderDetail,
  getOrderDetails,
  getOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
