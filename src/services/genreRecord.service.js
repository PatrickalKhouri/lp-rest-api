const httpStatus = require('http-status');
const { GenreRecord } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Band Member
 * @param {Object} genreRecordBody
 * @returns {Promise<GenreRecord>}
 */
const createGenreRecord = async (genreRecordBody) => {
  return GenreRecord.create(genreRecordBody);
};

/**
 * Query for Band Members
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGenreRecords = async (filter, options) => {
  const genreRecords = await GenreRecord.paginate(filter, options);
  return genreRecords;
};

/**
 * Get Band Member by id
 * @param {ObjectId} id
 * @returns {Promise<GenreRecord>}
 */
const getGenreRecordById = async (id) => {
  return GenreRecord.findById(id);
};

/**
 * Update GenreRecord by id
 * @param {ObjectId} GenreRecordId
 * @param {Object} updateBody
 * @returns {Promise<GenreRecord>}
 */
const updateGenreRecordById = async (genreRecordId, updateBody) => {
  const genreRecord = await getGenreRecordById(genreRecordId);
  if (!genreRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre Record not found');
  }
  Object.assign(genreRecord, updateBody);
  await genreRecord.save();
  return genreRecord;
};

/**
 * Delete Genre Record by id
 * @param {ObjectId} GenreRecordId
 * @returns {Promise<GenreRecord>}
 */
const deleteGenreRecordById = async (genreRecordId) => {
  const genreRecord = await getGenreRecordById(genreRecordId);
  if (!genreRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre Record not found');
  }
  await genreRecord.remove();
  return genreRecord;
};

module.exports = {
  createGenreRecord,
  queryGenreRecords,
  getGenreRecordById,
  updateGenreRecordById,
  deleteGenreRecordById,
};
