const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAlbum = {
  body: Joi.object().keys({
    stock: Joi.number().required(),
    description: Joi.string().required(),
    userId: Joi.string().custom(objectId).required(),
    recordId: Joi.string().custom(objectId).required(),
    year: Joi.number(),
    new: Joi.boolean().required(),
    price: Joi.number().required(),
    format: Joi.string().required(),
  }),
};

const getAlbums = {
  query: Joi.object().keys({
    stock: Joi.number(),
    description: Joi.string(),
    userId: Joi.string().custom(objectId),
    recordId: Joi.string().custom(objectId),
    year: Joi.number(),
    new: Joi.boolean(),
    price: Joi.number(),
    format: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAlbum,
  getAlbums,
};
