const mongoose = require('mongoose');
const RecordGenre = require('../../src/models/recordGenre.model');
const { genreOne, genreTwo } = require('./genre.fixture');
const { recordOne, recordTwo } = require('./record.fixture');

const recordGenreOne = {
  _id: mongoose.Types.ObjectId(),
  artistId: genreOne._id,
  personId: recordOne._id,
};

const recordGenreTwo = {
  _id: mongoose.Types.ObjectId(),
  artistId: genreTwo._id,
  personId: recordTwo._id,
};

const insertrecordGenres = async (recordGenres) => {
  await RecordGenre.insertMany(recordGenres.map((recordGenre) => ({ ...recordGenre })));
};

module.exports = {
  recordGenreOne,
  recordGenreTwo,
  insertrecordGenres,
};
