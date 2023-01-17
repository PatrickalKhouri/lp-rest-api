const httpStatus = require('http-status');
const { OrderItem } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user Payment
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
const createOrderItem = async (orderItemBody) => {
  return OrderItem.create(orderItemBody);
};

/**
 * Query for order Item
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrderItems = async (filter, options) => {
  const orderItem = await OrderItem.paginate(filter, options);
  return orderItem;
};

/**
 * Get order Item item by id
 * @param {ObjectId} id
 * @returns {Promise<OrderItem>}
 */
const getOrderItemById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return OrderItem.findById(id);
  }
  return null;
};

/**
 * Update order Item by id
 * @param {ObjectId} orderItemId
 * @param {Object} updateBody
 * @returns {Promise<OrderItem>}
 */
const updateOrderItemById = async (orderItemId, updateBody) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }
  Object.assign(orderItem, updateBody);
  await orderItem.save();
  return orderItem;
};

/**
 * Delete user by id
 * @param {ObjectId} orderItemId
 * @returns {Promise<OrderItem>}
 */
const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }
  await orderItem.remove();
  return orderItem;
};

module.exports = {
  createOrderItem,
  queryOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
};
