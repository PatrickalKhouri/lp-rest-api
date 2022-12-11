const httpStatus = require('http-status');
const { ShoppingSession } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a shopping session
 * @param {Object} shoppingSessionBody
 * @returns {Promise<ShoppingSession>}
 */
const createShoppingSession = async (shoppingSessionBody) => {
  return ShoppingSession.create(shoppingSessionBody);
};

/**
 * Query for shopping session
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryShoppingSession = async (filter, options) => {
  const shoppingSessions = await ShoppingSession.paginate(filter, options);
  return shoppingSessions;
};

/**
 * Get shopping session by id
 * @param {ObjectId} id
 * @returns {Promise<ShoppingSession>}
 */
const getShoppingSessionById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return ShoppingSession.findById(id);
  }
  return null;
};

/**
 * Update user by id
 * @param {ObjectId} shoppingSessionId
 * @param {Object} updateBody
 * @returns {Promise<ShoppingSession>}
 */
const updateShoppingSessionById = async (shoppingSessionId, updateBody) => {
  const shoppingSession = await getShoppingSessionById(shoppingSessionId);
  if (!shoppingSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shopping Session not found');
  }
  Object.assign(shoppingSession, updateBody);
  await shoppingSession.save();
  return shoppingSession;
};

/**
 * Delete user by id
 * @param {ObjectId} shoppingSessionId
 * @returns {Promise<ShoppingSession>}
 */
const deleteShoppingSessionById = async (shoppingSessionId) => {
  const shoppingSession = await getShoppingSessionById(shoppingSessionId);
  if (!shoppingSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shopping session not found');
  }
  await shoppingSession.remove();
  return shoppingSession;
};

module.exports = {
  createShoppingSession,
  queryShoppingSession,
  getShoppingSessionById,
  updateShoppingSessionById,
  deleteShoppingSessionById,
};
