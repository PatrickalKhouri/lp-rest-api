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

/**
 * Get Album by id
 * @param {ObjectId} id
 * @returns {Promise<Album>}
 */
const getAlbumById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Album.findById(id);
  }
  return Album.findById(id);
};

/**
 * Update album by id
 * @param {ObjectId} albumId
 * @param {Object} updateBody
 * @returns {Promise<Album>}
 */
const updateAlbumById = async (albumId, updateBody) => {
  const album = await getAlbumById(albumId);
  if (!album) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Album not found');
  }
  Object.assign(album, updateBody);
  await album.save();
  return album;
};

/**
 * Delete album by id
 * @param {ObjectId} albumId
 * @returns {Promise<Album>}
 */
const deleteAlbumById = async (albumId) => {
  const album = await getAlbumById(albumId);
  if (!album) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Album not found');
  }
  await album.remove();
  return album;
};

module.exports = {
  createAlbum,
  queryAlbums,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
};
