const httpStatus = require('http-status');
const { OrderDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user Payment
 * @param {Object} orderDetailBody
 * @returns {Promise<UserPayment>}
 */
const createCartItem = async (orderDetailBody) => {
  return OrderDetail.create(orderDetailBody);
};

/**
 * Query for order detail
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrderDetails = async (filter, options) => {
  const orderDetail = await OrderDetail.paginate(filter, options);
  return orderDetail;
};

/**
 * Get order detail item by id
 * @param {ObjectId} id
 * @returns {Promise<CartItem>}
 */
const getOrderDetailById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return OrderDetail.findById(id);
  }
  return null;
};

/**
 * Update order detail by id
 * @param {ObjectId} orderDetailId
 * @param {Object} updateBody
 * @returns {Promise<UserPayment>}
 */
const updateOrderDetailById = async (orderDetailId, updateBody) => {
  const orderDetail = await getOrderDetailById(orderDetailId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Detail not found');
  }
  Object.assign(orderDetail, updateBody);
  await orderDetail.save();
  return orderDetail;
};

/**
 * Delete user by id
 * @param {ObjectId} orderDetailId
 * @returns {Promise<UserPayment>}
 */
const deleteOrderDetailById = async (orderDetailId) => {
  const orderDetail = await getOrderDetailById(orderDetailId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Detail not found');
  }
  await orderDetail.remove();
  return orderDetail;
};

module.exports = {
  createCartItem,
  queryOrderDetails,
  getOrderDetailById,
  updateOrderDetailById,
  deleteOrderDetailById,
};
