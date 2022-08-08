const mongoose = require('mongoose');
const faker = require('faker');
const Artist = require('../../src/models/artist.model');
const { labelOne, labelTwo } = require('./label.fixture');

const artistOne = {
  _id: mongoose.Types.ObjectId(),
  labelId: labelOne._id,
  country: faker.address.country(),
  name: faker.name.firstName(),
};

const artistTwo = {
  _id: mongoose.Types.ObjectId(),
  labelId: labelTwo._id,
  country: faker.address.country(),
  name: faker.name.firstName(),
};

const insertArtists = async (artists) => {
  await Artist.insertMany(artists.map((artist) => ({ ...artist })));
};

module.exports = {
  artistOne,
  artistTwo,
  insertArtists,
};
