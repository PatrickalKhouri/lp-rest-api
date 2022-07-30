const mongoose = require('mongoose');
const faker = require('faker');
const UserAddress = require('../../src/models/userAddress.model');
const { userOne, userTwo } = require('./user.fixture');

const userAddressOne = {
  _id: mongoose.Types.ObjectId(),
  userId: userOne._id,
  streetName: 'Rua Fonte da Saudade',
  streetNumber: '124',
  postalCode: '22711-280',
  city: faker.address.city(),
  state: 'RJ',
  country: faker.address.country(),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const userAddressTwo = {
  _id: mongoose.Types.ObjectId(),
  userId: userTwo._id,
  streetName: 'Rua Macedo Sobrinho',
  streetNumber: '4',
  postalCode: '13165-000',
  city: faker.address.city(),
  state: 'SP',
  country: faker.address.country(),
  createdAt: faker.datatype.datetime(),
  modifiedAt: faker.datatype.datetime(),
};

const insertUserAddresses = async (userAddresses) => {
  await UserAddress.insertMany(userAddresses.map((userAddress) => ({ ...userAddress })));
};

module.exports = {
  userAddressOne,
  userAddressTwo,
  insertUserAddresses,
};
