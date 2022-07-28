const mongoose = require('mongoose');
const faker = require('faker');
const Person = require('../../src/models/person.model');

const personOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.firstName(),
  dateOfBirth: '2001-07-29T02:25:31.672Z',
  alive: faker.datatype.boolean(),
  nationality: faker.address.country(),
  gender: faker.name.gender(true),
};

const personTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.firstName(),
  dateOfBirth: '2001-07-29T02:25:31.672Z',
  alive: faker.datatype.boolean(),
  nationality: faker.address.country(),
  gender: faker.name.gender(true),
};

const insertPeople = async (people) => {
  await Person.insertMany(people.map((person) => ({ ...person })));
};

module.exports = {
  personOne,
  personTwo,
  insertPeople,
};
