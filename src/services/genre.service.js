const httpStatus = require('http-status');
const { Genre } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Genre
 * @param {Object} genreBody
 * @returns {Promise<Genre>}
 */
const createGenre = async (genreBody) => {
  return Genre.create(genreBody);
};

/**
 * Query for Genres
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGenres = async (filter, options) => {
  const genres = await Genre.paginate(filter, options);
  return genres;
};

/**
 * Get Genre by id
 * @param {ObjectId} id
 * @returns {Promise<Genre>}
 */
const getGenreById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Genre.findById(id);
  }
  return Genre.findById(id);
};

/**
 * Get Genre by name
 * @param {string} name
 * @returns {Promise<Genre>}
 */
const getGenreByName = async (name) => {
  return Genre.findOne({ name });
};

/**
 * Update Genre by id
 * @param {ObjectId} GenreId
 * @param {Object} updateBody
 * @returns {Promise<Genre>}
 */
const updateGenreById = async (genreId, updateBody) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }
  Object.assign(genre, updateBody);
  await genre.save();
  return genre;
};

/**
 * Delete Genre by id
 * @param {ObjectId} genreId
 * @returns {Promise<Genre>}
 */
const deleteGenreById = async (genreId) => {
  const genre = await getGenreById(genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  }
  await genre.remove();
  return genre;
};

module.exports = {
  createGenre,
  queryGenres,
  getGenreById,
  getGenreByName,
  updateGenreById,
  deleteGenreById,
};
