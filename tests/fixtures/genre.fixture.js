const mongoose = require('mongoose');
const Genre = require('../../src/models/genre.model');

const genreOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'Rock',
};

const genreTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Pop',
};

const insertGenres = async (genres) => {
  await Genre.insertMany(genres.map((genre) => ({ ...genre })));
};

module.exports = {
  genreOne,
  genreTwo,
  insertGenres,
};
