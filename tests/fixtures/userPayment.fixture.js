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
};

const userPaymentTwo = {
  _id: mongoose.Types.ObjectId(),
  userId: userTwo._id,
  accountNumber: faker.finance.account(),
  paymentType: 'Boleto',
  provider: 'Master Card',
};

const insertUserPayments = async (userPayments) => {
  await UserPayment.insertMany(userPayments.map((userPayment) => ({ ...userPayment })));
};

module.exports = {
  userPaymentOne,
  userPaymentTwo,
  insertUserPayments,
};
