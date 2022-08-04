const mongoose = require('mongoose');
const faker = require('faker');
const Label = require('../../src/models/label.model');

const labelOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.firstName(),
  country: faker.address.country(),
};

const labelTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.firstName(),
  country: faker.address.country(),
};

const insertLabels = async (labels) => {
  await Label.insertMany(labels.map((label) => ({ ...label })));
};

module.exports = {
  labelOne,
  labelTwo,
  insertLabels,
};
