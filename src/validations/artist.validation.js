const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createArtist = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    country: Joi.string(),
    labelId: Joi.string().required.custom(objectId),
  }),
};

const getLabels = {
  query: Joi.object().keys({
    name: Joi.string(),
    country: Joi.string(),
    labelId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getArtist = {
  params: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
  }),
};

const updateArtist = {
  params: Joi.object().keys({
    artistId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      country: Joi.string(),
      labelId: Joi.string(),
    })
    .min(1),
};

const deleteArtist = {
  params: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createArtist,
  getLabels,
  getArtist,
  updateArtist,
  deleteArtist,
};
