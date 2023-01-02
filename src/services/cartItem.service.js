const httpStatus = require('http-status');
const { CartItem } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user Payment
 * @param {Object} cartItemBody
 * @returns {Promise<UserPayment>}
 */
const createCartItem = async (cartItemBody) => {
  return CartItem.create(cartItemBody);
};

/**
 * Query for cart items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCartItems = async (filter, options) => {
  const cartItems = await CartItem.paginate(filter, options);
  return cartItems;
};

/**
 * Get cart item by id
 * @param {ObjectId} id
 * @returns {Promise<CartItem>}
 */
const getCartItemById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return CartItem.findById(id);
  }
  return null;
};

/**
 * Update user by id
 * @param {ObjectId} cartItemId
 * @param {Object} updateBody
 * @returns {Promise<UserPayment>}
 */
const updateCartItemById = async (cartItemId, updateBody) => {
  const cartItem = await getCartItemById(cartItemId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Item not found');
  }
  Object.assign(cartItem, updateBody);
  await cartItem.save();
  return cartItem;
};

/**
 * Delete user by id
 * @param {ObjectId} cartItemId
 * @returns {Promise<UserPayment>}
 */
const deleteCartItemById = async (cartItemId) => {
  const cartItem = await getCartItemById(cartItemId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart Item not found');
  }
  await cartItem.remove();
  return cartItem;
};

module.exports = {
  createCartItem,
  queryCartItems,
  getCartItemById,
  updateCartItemById,
  deleteCartItemById,
};
