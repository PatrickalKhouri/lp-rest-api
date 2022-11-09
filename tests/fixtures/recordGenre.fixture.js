const mongoose = require('mongoose');
const RecordGenre = require('../../src/models/recordGenre.model');
const { genreOne, genreTwo } = require('./genre.fixture');
const { recordOne, recordTwo } = require('./record.fixture');

const recordGenreOne = {
  _id: mongoose.Types.ObjectId(),
  genreId: genreOne._id,
  recordId: recordOne._id,
};

const recordGenreTwo = {
  _id: mongoose.Types.ObjectId(),
  genreId: genreTwo._id,
  recordId: recordTwo._id,
};

const insertRecordGenres = async (recordGenres) => {
  await RecordGenre.insertMany(recordGenres.map((recordGenre) => ({ ...recordGenre })));
};

module.exports = {
  recordGenreOne,
  recordGenreTwo,
  insertRecordGenres,
};
