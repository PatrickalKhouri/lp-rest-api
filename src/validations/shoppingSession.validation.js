const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createShoppingSession = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    total: Joi.string().required(),
  }),
};

const getShoppingSessions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    total: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getShoppingSession = {
  params: Joi.object().keys({
    shoppingSessionId: Joi.string().custom(objectId),
  }),
};

const updateShoppingSession = {
  params: Joi.object().keys({
    shoppingSessionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      total: Joi.string(),
    })
    .min(1),
};

const deleteShoppingSession = {
  params: Joi.object().keys({
    shoppingSessionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createShoppingSession,
  getShoppingSessions,
  getShoppingSession,
  updateShoppingSession,
  deleteShoppingSession,
};
