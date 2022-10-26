const mongoose = require('mongoose');
const faker = require('faker');
const Record = require('../../src/models/record.model');
const { artistOne, artistTwo } = require('./artist.fixture');
const { labelOne, labelTwo } = require('./label.fixture');

const recordOne = {
  _id: mongoose.Types.ObjectId(),
  artistId: String(artistOne._id),
  labelId: String(labelOne._id),
  name: 'To Pimp a Butterfly',
  releaseYear: Number(faker.finance.amount(1800, 2023, 0)),
  country: faker.address.country(),
  recordType: 'EP',
  duration: '20:10',
  language: 'English',
  numberOfTracks: Number(faker.finance.amount(1, 30, 0)),
};

const recordTwo = {
  _id: mongoose.Types.ObjectId(),
  artistId: String(artistTwo._id),
  labelId: String(labelTwo._id),
  name: 'Blonde',
  recordType: 'LP',
  releaseYear: Number(faker.finance.amount(1800, 2023, 0)),
  country: faker.address.country(),
  duration: '40:10',
  language: 'English',
  numberOfTracks: Number(faker.finance.amount(1, 30, 0)),
};

const insertRecords = async (records) => {
  await Record.insertMany(records.map((record) => ({ ...record })));
};

module.exports = {
  recordOne,
  recordTwo,
  insertRecords,
};
