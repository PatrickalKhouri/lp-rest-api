const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLabel = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    country: Joi.string(),
  }),
};

const getLabels = {
  query: Joi.object().keys({
    name: Joi.string(),
    country: Joi.string(),
  }),
};

const getLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(objectId),
  }),
};

const updateLabel = {
  params: Joi.object().keys({
    labelId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      country: Joi.string(),
    })
    .min(1),
};

const deleteUserLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createLabel,
  getLabels,
  getLabel,
  updateLabel,
  deleteUserLabel,
};
