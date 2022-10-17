const Joi = require('joi');
const { objectId, recordDuration } = require('./custom.validation');

const createRecord = {
  body: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
    labelId: Joi.string().custom(objectId),
    name: Joi.string().required(),
    releaseYear: Joi.number().required(),
    apartmentNumber: Joi.string(),
    country: Joi.string(),
    duration: Joi.string().required().custom(recordDuration),
    language: Joi.string().required(),
    numberOfTracks: Joi.number().required(),
  }),
};

module.exports = {
  createRecord,
};
