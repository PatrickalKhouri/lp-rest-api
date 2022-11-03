const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRecordGenre = {
  body: Joi.object().keys({
    genreId: Joi.string().custom(objectId).required(),
    recordId: Joi.string().custom(objectId).required(),
  }),
};

const getRecordGenres = {
  query: Joi.object().keys({
    genreId: Joi.string().custom(objectId),
    recordId: Joi.string().custom(objectId),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRecordGenre = {
  params: Joi.object().keys({
    recordGenreId: Joi.string().custom(objectId),
  }),
};

const updateRecordGenre = {
  params: Joi.object().keys({
    recordGenreId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      genreId: Joi.string().custom(objectId),
      recordId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteRecordGenre = {
  params: Joi.object().keys({
    recordGenreId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRecordGenre,
  getRecordGenres,
  getRecordGenre,
  updateRecordGenre,
  deleteRecordGenre,
};
