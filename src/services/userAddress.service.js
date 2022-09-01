const httpStatus = require('http-status');
const { UserAddress } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userAddressBody
 * @returns {Promise<UserAddress>}
 */
const createUserAddress = async (userAddressBody) => {
  return UserAddress.create(userAddressBody);
};

module.exports = {
  createUserAddress,
};
