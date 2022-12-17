const httpStatus = require('http-status');
const { UserPayment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user Payment
 * @param {Object} userPaymentBody
 * @returns {Promise<UserPayment>}
 */
const createUserPayment = async (userPaymentBody) => {
  return UserPayment.create(userPaymentBody);
};

/**
 * Query for user Paymentses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserPayments = async (filter, options) => {
  const userPayments = await UserPayment.paginate(filter, options);
  return userPayments;
};

/**
 * Get user Payment by id
 * @param {ObjectId} id
 * @returns {Promise<UserPayment>}
 */
const getUserPaymentById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return UserPayment.findById(id);
  }
  return null;
};

/**
 * Update user by id
 * @param {ObjectId} userPaymentId
 * @param {Object} updateBody
 * @returns {Promise<UserPayment>}
 */
const updateUserPaymentById = async (userPaymentId, updateBody) => {
  const userPayment = await getUserPaymentById(userPaymentId);
  if (!userPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Payment not found');
  }
  Object.assign(userPayment, updateBody);
  await userPayment.save();
  return userPayment;
};

/**
 * Delete user by id
 * @param {ObjectId} userPaymentId
 * @returns {Promise<UserPayment>}
 */
const deleteUserPaymentById = async (userPaymentId) => {
  const userPayment = await getUserPaymentById(userPaymentId);
  if (!userPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Payment not found');
  }
  await userPayment.remove();
  return userPayment;
};

module.exports = {
  createUserPayment,
  queryUserPayments,
  getUserPaymentById,
  updateUserPaymentById,
  deleteUserPaymentById,
};
