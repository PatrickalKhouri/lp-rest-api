const mongoose = require('mongoose');
const faker = require('faker');
const Album = require('../../src/models/album.model');
const { recordOne, recordTwo } = require('./record.fixture');
const { userOne, userTwo } = require('./user.fixture');

const albumOne = {
  _id: mongoose.Types.ObjectId(),
  recordId: String(recordOne._id),
  userId: String(userOne._id),
  description: faker.lorem.lines(),
  stock: Number(faker.finance.amount(0, 50, 2)),
  year: Number(faker.finance.amount(1800, 2022, 0)),
  new: faker.datatype.boolean(),
  price: Number(faker.finance.amount(1, 1000, 2)),
  format: 'CD',
};

const albumTwo = {
  _id: mongoose.Types.ObjectId(),
  recordId: String(recordTwo._id),
  userId: String(userTwo._id),
  description: faker.lorem.lines(),
  stock: faker.finance.amount(0, 50, 2),
  year: faker.finance.amount(1800, 2022, 0),
  new: faker.datatype.boolean(),
  price: faker.finance.amount(1, 1000, 2),
  format: 'Vinyl',
};

const insertAlbums = async (albums) => {
  await Album.insertMany(albums.map((album) => ({ ...album })));
};

module.exports = {
  albumOne,
  albumTwo,
  insertAlbums,
};
