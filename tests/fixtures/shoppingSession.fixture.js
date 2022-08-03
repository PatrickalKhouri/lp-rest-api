const mongoose = require('mongoose');
const faker = require('faker');
const ShoppingSession = require('../../src/models/userPayment.model');
const { userOne, userTwo } = require('./user.fixture');

const shoppingSessionOne = {
  _id: mongoose.Types.ObjectId(),
  userId: userOne._id,
  total: faker.finance.amount(0, 1000, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const shoppingSessionTwo = {
  _id: mongoose.Types.ObjectId(),
  userId: userTwo._id,
  total: faker.finance.amount(0, 1000, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const insertShoppingSessions = async (shoppingSessions) => {
  await ShoppingSession.insertMany(shoppingSessions.map((shoppingSession) => ({ ...shoppingSession })));
};

module.exports = {
  shoppingSessionOne,
  shoppingSessionTwo,
  insertShoppingSessions,
};
