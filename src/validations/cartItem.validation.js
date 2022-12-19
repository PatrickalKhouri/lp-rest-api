const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCartItems = {
  body: Joi.object().keys({
    shoppingSessionId: Joi.string().custom(objectId).required(),
    albumId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().required(),
  }),
};

const getCartItems = {
  query: Joi.object().keys({
    shoppingSessionId: Joi.string().custom(objectId),
    albumId: Joi.string().custom(objectId).required(),
    quantity: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCartItem = {
  params: Joi.object().keys({
    cartItemId: Joi.string().custom(objectId),
  }),
};

const updateCartItem = {
  params: Joi.object().keys({
    cartItemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      shoppingSessionId: Joi.string().custom(objectId),
      albumId: Joi.string().custom(objectId),
      quantity: Joi.string(),
    })
    .min(1),
};

const deleteCartItem = {
  params: Joi.object().keys({
    cartItemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCartItems,
  getCartItems,
  getCartItem,
  updateCartItem,
  deleteCartItem,
};
