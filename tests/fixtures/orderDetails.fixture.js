const mongoose = require('mongoose');
const faker = require('faker');
const OrderDetail = require('../../src/models/orderDetail.model');
const { userPaymentOne, userPaymentTwo } = require('./userPayment.fixture');
const { userOne, userTwo } = require('./user.fixture');

const orderDetailOne = {
  _id: mongoose.Types.ObjectId(),
  userId: userOne._id,
  userPaymentId: userPaymentOne._id,
  total: faker.finance.amount(0, 1000, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const orderDetailTwo = {
  _id: mongoose.Types.ObjectId(),
  userId: userTwo._id,
  userPaymentId: userPaymentTwo._id,
  total: faker.finance.amount(0, 1000, 2),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const inserOrderDetails = async (orderDetails) => {
  await OrderDetail.insertMany(orderDetails.map((orderDetail) => ({ ...orderDetail })));
};

module.exports = {
  orderDetailOne,
  orderDetailTwo,
  inserOrderDetails,
};
