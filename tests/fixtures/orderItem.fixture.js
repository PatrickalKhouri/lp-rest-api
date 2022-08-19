const mongoose = require('mongoose');
const faker = require('faker');
const OrderItem = require('../../src/models/orderItem.model');
const { orderDetailOne, orderDetailTwo } = require('./orderDetail.fixture');
const { albumOne, albumTwo } = require('./album.fixture');

const orderItemOne = {
  _id: mongoose.Types.ObjectId(),
  orderDetailId: orderDetailOne._id,
  albumId: albumOne._id,
  quantity: faker.finance.amount(0, 50, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const orderItemTwo = {
  _id: mongoose.Types.ObjectId(),
  orderDetailId: orderDetailTwo._id,
  albumId: albumTwo._id,
  quantity: faker.finance.amount(0, 50, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const inserOrderItems = async (orderItems) => {
  await OrderItem.insertMany(orderItems.map((orderItem) => ({ ...orderItem })));
};

module.exports = {
  orderItemOne,
  orderItemTwo,
  inserOrderItems,
};
