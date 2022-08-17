const mongoose = require('mongoose');
const faker = require('faker');
const CartItem = require('../../src/models/cartItem.model');
const { shoppingSessionOne, shoppingSessionTwo } = require('./shoppingSession.fixture');
const { albumOne, albumTwo } = require('./album.fixture');

const cartItemOne = {
  _id: mongoose.Types.ObjectId(),
  shoppingSessionId: shoppingSessionOne._id,
  albumId: albumOne._id,
  quantity: faker.finance.amount(0, 50, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const cartItemTwo = {
  _id: mongoose.Types.ObjectId(),
  shoppingSessionId: shoppingSessionTwo._id,
  albumId: albumTwo._id,
  quantity: faker.finance.amount(0, 50, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const insertCartItems = async (cartItems) => {
  await CartItem.insertMany(cartItems.map((cartItem) => ({ ...cartItem })));
};

module.exports = {
  cartItemOne,
  cartItemTwo,
  insertCartItems,
};
