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

/**
 * Query for records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryRecords = async (filter, options) => {
  const records = await Record.paginate(filter, options);
  return records;
};

/**
 * Get record by id
 * @param {ObjectId} id
 * @returns {Promise<Record>}
 */
const getRecordById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Record.findById(id);
  }
  return Record.findById(id);
};

/**
 * Get Record by name
 * @param {string} name
 * @returns {Promise<Record>}
 */
const getRecordByName = async (name) => {
  return Record.findOne({ name });
};

/**
 * Update record by id
 * @param {ObjectId} recordId
 * @param {Object} updateBody
 * @returns {Promise<Record>}
 */
const updateRecordById = async (recordId, updateBody) => {
  const record = await getRecordById(recordId);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');
  }
  Object.assign(record, updateBody);
  await record.save();
  return record;
};

/**
 * Delete record by id
 * @param {ObjectId} recordId
 * @returns {Promise<Record>}
 */
const deleteRecordById = async (recordId) => {
  const record = await getRecordById(recordId);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');
  }
  await Record.remove();
  return record;
};

module.exports = {
  createRecord,
  queryRecords,
  getRecordById,
  getRecordByName,
  updateRecordById,
  deleteRecordById,
};
