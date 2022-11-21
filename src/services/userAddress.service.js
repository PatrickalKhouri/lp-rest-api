const httpStatus = require('http-status');
const { UserAddress } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user address
 * @param {Object} userAddressBody
 * @returns {Promise<UserAddress>}
 */
const createUserAddress = async (userAddressBody) => {
  return UserAddress.create(userAddressBody);
};

/**
 * Query for user addressses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserAddresses = async (filter, options) => {
  const userAddresses = await UserAddress.paginate(filter, options);
  return userAddresses;
};

/**
 * Get user address by id
 * @param {ObjectId} id
 * @returns {Promise<UserAddress>}
 */
const getUserAddressById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return UserAddress.findById(id);
  }
  return null;
};

/**
 * Update user by id
 * @param {ObjectId} userAddressId
 * @param {Object} updateBody
 * @returns {Promise<UserAddress>}
 */
const updateUserAddressById = async (userAddressId, updateBody) => {
  const userAddress = await getUserAddressById(userAddressId);
  if (!userAddress) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  Object.assign(userAddress, updateBody);
  await userAddress.save();
  return userAddress;
};

/**
 * Delete user by id
 * @param {ObjectId} userAddressId
 * @returns {Promise<UserAddress>}
 */
const deleteUserAddressById = async (userAddressId) => {
  const userAddress = await getUserAddressById(userAddressId);
  if (!userAddress) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Address not found');
  }
  await userAddress.remove();
  return userAddress;
};

module.exports = {
  createUserAddress,
  queryUserAddresses,
  getUserAddressById,
  updateUserAddressById,
  deleteUserAddressById,
};
