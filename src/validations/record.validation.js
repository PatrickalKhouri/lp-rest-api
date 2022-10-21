const Joi = require('joi');
const { objectId, recordDuration } = require('./custom.validation');

const createRecord = {
  body: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
    labelId: Joi.string().custom(objectId),
    name: Joi.string().required(),
    releaseYear: Joi.number().required(),
    country: Joi.string(),
    duration: Joi.string().required().custom(recordDuration),
    language: Joi.string().required(),
    recordType: Joi.string().required(),
    numberOfTracks: Joi.number().required(),
  }),
};

const getRecords = {
  query: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
    labelId: Joi.string().custom(objectId),
    recordType: Joi.string().required(),
    name: Joi.string(),
    releaseYear: Joi.number(),
    country: Joi.string(),
    duration: Joi.string().custom(recordDuration),
    language: Joi.string(),
    numberOfTracks: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRecord = {
  params: Joi.object().keys({
    recordId: Joi.string().custom(objectId),
  }),
};

const updateRecord = {
  params: Joi.object().keys({
    recordId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      artistId: Joi.string().custom(objectId),
      labelId: Joi.string().custom(objectId),
      name: Joi.string(),
      recordType: Joi.string().required(),
      releaseYear: Joi.number(),
      country: Joi.string(),
      duration: Joi.string().custom(recordDuration),
      language: Joi.string(),
      numberOfTracks: Joi.number(),
    })
    .min(1),
};

const deleteRecord = {
  params: Joi.object().keys({
    recordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
};
