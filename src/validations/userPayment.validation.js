const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserPayment = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    paymentType: Joi.string().required(),
    provider: Joi.string(),
    accountNumber: Joi.string().required(),
  }),
};

const getUserPayments = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    paymentType: Joi.string(),
    provider: Joi.string(),
    accountNumber: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUserPayment = {
  params: Joi.object().keys({
    userPaymentId: Joi.string().custom(objectId),
  }),
};

const updateUserPayment = {
  params: Joi.object().keys({
    userPaymentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      paymentType: Joi.string(),
      provider: Joi.string(),
      accountNumber: Joi.string(),
    })
    .min(1),
};

const deleteUserPayment = {
  params: Joi.object().keys({
    userPaymentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUserPayment,
  getUserPayments,
  getUserPayment,
  updateUserPayment,
  deleteUserPayment,
};
