const mongoose = require('mongoose');
const faker = require('faker');
const UserPayment = require('../../src/models/userPayment.model');
const { userOne, userTwo } = require('./user.fixture');

const userPaymentOne = {
  _id: mongoose.Types.ObjectId(),
  userId: userOne._id,
  accountNumber: faker.finance.account(),
  paymentType: 'Pix',
  provider: 'Visa',
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const userPaymentTwo = {
  _id: mongoose.Types.ObjectId(),
  userId: userTwo._id,
  accountNumber: faker.finance.account(),
  paymentType: 'Boleto',
  provider: 'Master Card',
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const insertUserPayments = async (userPayments) => {
  await UserPayment.insertMany(userPayments.map((userPayment) => ({ ...userPayment })));
};

module.exports = {
  userPaymentOne,
  userPaymentTwo,
  insertUserPayments,
};
