const httpStatus = require('http-status');
const { Album } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an Album
 * @param {Object} albumBody
 * @returns {Promise<Album>}
 */
const createAlbum = async (albumBody) => {
  return Album.create(albumBody);
};

/**
 * Query for albums
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryAlbums = async (filter, options) => {
  const albums = await Album.paginate(filter, options);
  return albums;
};

module.exports = {
  createAlbum,
  queryAlbums,
};
