const httpStatus = require('http-status');
const { Record } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Record
 * @param {Object} recordBody
 * @returns {Promise<Record>}
 */
const createRecord = async (recordBody) => {
  return Record.create(recordBody);
};

module.exports = {
  createRecord,
};
