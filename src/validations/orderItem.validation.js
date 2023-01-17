const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    orderDetailId: Joi.string().custom(objectId).required(),
    albumId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().required(),
  }),
};

const getOrderItems = {
  query: Joi.object().keys({
    orderDetailId: Joi.string().custom(objectId),
    albumId: Joi.string().custom(objectId),
    quantity: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const updateOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      orderDetailId: Joi.string().custom(objectId),
      albumId: Joi.string().custom(objectId),
      quantity: Joi.number(),
    })
    .min(1),
};

const deleteOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrderItem,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
