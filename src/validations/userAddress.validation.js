const Joi = require('joi');
const { objectId, postalCode } = require('./custom.validation');

const createUserAddress = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    streetName: Joi.string().required(),
    buildingNumber: Joi.string().required(),
    apartmentNumber: Joi.string(),
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
