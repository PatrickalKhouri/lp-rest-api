const mongoose = require('mongoose');
const Genre = require('../../src/models/genre.model');

const genreOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'rock',
};

const genreTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'pop',
};

const insertGenres = async (genres) => {
  await Genre.insertMany(genres.map((genre) => ({ ...genre })));
};

module.exports = {
  genreOne,
  genreTwo,
  insertGenres,
};
