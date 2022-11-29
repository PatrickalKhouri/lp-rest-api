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

const getAlbum = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectId),
  }),
};

const updateAlbum = {
  params: Joi.object().keys({
    albumId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      stock: Joi.number(),
      description: Joi.string(),
      userId: Joi.string().custom(objectId),
      recordId: Joi.string().custom(objectId),
      year: Joi.number(),
      new: Joi.boolean(),
      price: Joi.number(),
      format: Joi.string(),
    })
    .min(1),
};

const deleteAlbum = {
  params: Joi.object().keys({
    albumId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAlbum,
  getAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
};
