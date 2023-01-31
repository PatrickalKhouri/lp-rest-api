const httpStatus = require('http-status');
const { Person } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Person
 * @param {Object} personBody
 * @returns {Promise<Person>}
 */
const createPerson = async (personBody) => {
  return Person.create(personBody);
};

/**
 * Query for People
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPeople = async (filter, options) => {
  const people = await Person.paginate(filter, options);
  return people;
};

/**
 * Get Person by id
 * @param {ObjectId} id
 * @returns {Promise<Person>}
 */
const getPersonById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Person.findById(id);
  }
  return Person.findById(id);
};

/**
 * Get Person by name
 * @param {string} name
 * @returns {Promise<Person>}
 */
const getPersonByName = async (name) => {
  return Person.findOne({ name });
};

/**
 * Update Person by id
 * @param {ObjectId} personId
 * @param {Object} updateBody
 * @returns {Promise<Person>}
 */
const updatePersonById = async (personId, updateBody) => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
  }
  Object.assign(person, updateBody);
  await person.save();
  return person;
};

/**
 * Delete Person by id
 * @param {ObjectId} personId
 * @returns {Promise<Person>}
 */
const deletePersonById = async (personId) => {
  const person = await getPersonById(personId);
  if (!person) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
  }
  await person.remove();
  return person;
};

module.exports = {
  createPerson,
  queryPeople,
  getPersonById,
  getPersonByName,
  updatePersonById,
  deletePersonById,
};
