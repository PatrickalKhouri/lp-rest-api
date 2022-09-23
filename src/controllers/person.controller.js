const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { personService } = require('../services');

const createPerson = catchAsync(async (req, res) => {
  const person = await personService.createPerson(req.body);
  res.status(httpStatus.CREATED).send(person);
});

const getPeople = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'dateOfBirth', 'alive', 'gender', 'nationality']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await personService.queryPeople(filter, options);
  res.send(result);
});

const getPerson = catchAsync(async (req, res) => {
  const person = await personService.getPersonById(req.params.personId);
  if (!person) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
  }
  res.send(person);
});

const updatePerson = catchAsync(async (req, res) => {
  const person = await personService.updatePersonById(req.params.personId, req.body);
  res.send(person);
});

const deletePerson = catchAsync(async (req, res) => {
  await personService.deletePersonById(req.params.personId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson,
};
