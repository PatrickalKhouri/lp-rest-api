const httpStatus = require('http-status');
const { Artist } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Artist
 * @param {Object} artistBody
 * @returns {Promise<Artist>}
 */
const createArtist = async (artistBody) => {
  return Artist.create(artistBody);
};

/**
 * Query for Artists
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryArtists = async (filter, options) => {
  const artists = await Artist.paginate(filter, options);
  return artists;
};

/**
 * Get Artist by id
 * @param {ObjectId} id
 * @returns {Promise<Artist>}
 */
const getArtistById = async (id) => {
  return Artist.findById(id);
};

/**
 * Get Artists by name
 * @param {string} name
 * @returns {Promise<Artist>}
 */
const getArtistByName = async (name) => {
  return Artist.findOne({ name });
};

/**
 * Update Artist by id
 * @param {ObjectId} artistId
 * @param {Object} updateBody
 * @returns {Promise<Artist>}
 */
const updateArtistById = async (artistId, updateBody) => {
  const artist = await getArtistById(artistId);
  if (!artist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
  }
  Object.assign(artist, updateBody);
  await artist.save();
  return artist;
};

/**
 * Delete Artist by id
 * @param {ObjectId} artistId
 * @returns {Promise<Artist>}
 */
const deleteArtistById = async (artistId) => {
  const artist = await getArtistById(artistId);
  if (!artist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
  }
  await artist.remove();
  return artist;
};

module.exports = {
  createArtist,
  queryArtists,
  getArtistById,
  getArtistByName,
  updateArtistById,
  deleteArtistById,
};
