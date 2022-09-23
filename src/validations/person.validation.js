const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPerson = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    dateOfBirth: Joi.date(),
    alive: Joi.boolean().required(),
    nationality: Joi.string().required(),
    gender: Joi.string().required(),
  }),
};

const getPeople = {
  query: Joi.object().keys({
    name: Joi.string(),
    dateOfBirth: Joi.date(),
    alive: Joi.boolean(),
    nationality: Joi.string(),
    gender: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPerson = {
  params: Joi.object().keys({
    personId: Joi.string().custom(objectId),
  }),
};

const updatePerson = {
  params: Joi.object().keys({
    personId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      dateOfBirth: Joi.date(),
      alive: Joi.boolean(),
      nationality: Joi.string(),
      gender: Joi.string(),
    })
    .min(1),
};

const deletePerson = {
  params: Joi.object().keys({
    personId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPerson,
  getPeople,
  getPerson,
  updatePerson,
  deletePerson,
};
