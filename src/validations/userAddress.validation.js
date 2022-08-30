const Joi = require('joi');
const { objectId, postalCode } = require('./custom.validation');

const createUserAddress = {
  body: Joi.object().keys({
    streetName: Joi.string().required(),
    streetNumber: Joi.string().required(),
    complement: Joi.string(),
    postalCode: Joi.string().required().custom(postalCode),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }),
};

module.exports = {
  createUserAddress,
};
