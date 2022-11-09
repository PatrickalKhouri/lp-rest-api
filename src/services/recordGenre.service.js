const httpStatus = require('http-status');
const { RecordGenre } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Band Member
 * @param {Object} recordGenreBody
 * @returns {Promise<RecordGenre>}
 */
const createRecordGenre = async (recordGenreBody) => {
  return RecordGenre.create(recordGenreBody);
};

/**
 * Query for Record/Genre
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRecordGenres = async (filter, options) => {
  const recordGenres = await RecordGenre.paginate(filter, options);
  return recordGenres;
};

/**
 * Get Band Member by id
 * @param {ObjectId} id
 * @returns {Promise<RecordGenre>}
 */
const getRecordGenreById = async (id) => {
  return RecordGenre.findById(id);
};

/**
 * Update RecordGenre by id
 * @param {ObjectId} recordGenreId
 * @param {Object} updateBody
 * @returns {Promise<RecordGenre>}
 */
const updateRecordGenreById = async (recordGenreId, updateBody) => {
  const recordGenre = await getRecordGenreById(recordGenreId);
  if (!recordGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre Record not found');
  }
  Object.assign(recordGenre, updateBody);
  await recordGenre.save();
  return recordGenre;
};

/**
 * Delete Genre Record by id
 * @param {ObjectId} recordGenreId
 * @returns {Promise<RecordGenre>}
 */
const deleteRecordGenreById = async (recordGenreId) => {
  const recordGenre = await getRecordGenreById(recordGenreId);
  if (!recordGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre Record not found');
  }
  await recordGenre.remove();
  return recordGenre;
};

module.exports = {
  createRecordGenre,
  queryRecordGenres,
  getRecordGenreById,
  updateRecordGenreById,
  deleteRecordGenreById,
};
