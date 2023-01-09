const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderDetail = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    userPaymentId: Joi.string().custom(objectId).required(),
    total: Joi.number().required(),
  }),
};

const getOrderDetails = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    userPaymentId: Joi.string().custom(objectId),
    total: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrderDetail = {
  params: Joi.object().keys({
    orderDetailId: Joi.string().custom(objectId),
  }),
};

const updateOrderDetail = {
  params: Joi.object().keys({
    orderDetailId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      userPaymentId: Joi.string().custom(objectId),
      total: Joi.string(),
    })
    .min(1),
};

const deleteOrderDetail = {
  params: Joi.object().keys({
    orderDetailId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrderDetail,
  getOrderDetails,
  getOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
