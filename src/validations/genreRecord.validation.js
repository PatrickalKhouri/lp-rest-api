const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGenreRecord = {
  body: Joi.object().keys({
    genreId: Joi.string().custom(objectId).required(),
    recordId: Joi.string().custom(objectId).required(),
  }),
};

const getGenreRecords = {
  query: Joi.object().keys({
    genreId: Joi.string().custom(objectId),
    recordId: Joi.string().custom(objectId),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGenreRecord = {
  params: Joi.object().keys({
    genreRecordId: Joi.string().custom(objectId),
  }),
};

const updateGenreRecord = {
  params: Joi.object().keys({
    genreRecordId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      genreId: Joi.string().custom(objectId),
      recordId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteGenreRecord = {
  params: Joi.object().keys({
    genreRecordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createGenreRecord,
  getGenreRecords,
  getGenreRecord,
  updateGenreRecord,
  deleteGenreRecord,
};
