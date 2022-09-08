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

const getUserAddresses = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUserAddress = {
  params: Joi.object().keys({
    userAddressId: Joi.string().custom(objectId),
  }),
};

const updateUserAddress = {
  params: Joi.object().keys({
    userAddressId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      streetName: Joi.string(),
      buildingNumber: Joi.string(),
      apartmentNumber: Joi.string(),
      complement: Joi.string(),
      postalCode: Joi.string().custom(postalCode),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
    })
    .min(1),
};

const deleteUserAddress = {
  params: Joi.object().keys({
    userAddressId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUserAddress,
  getUserAddresses,
  getUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
