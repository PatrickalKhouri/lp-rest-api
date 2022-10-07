const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBandMember = {
  body: Joi.object().keys({
    artistId: Joi.string().custom(objectId).required(),
    personId: Joi.string().custom(objectId).required(),
  }),
};

const getBandMembers = {
  query: Joi.object().keys({
    artistId: Joi.string().custom(objectId),
    personId: Joi.string().custom(objectId),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBandMember = {
  params: Joi.object().keys({
    bandMemberId: Joi.string().custom(objectId),
  }),
};

const updateBandMember = {
  params: Joi.object().keys({
    bandMemberId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      artistId: Joi.string().custom(objectId),
      personId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteBandMember = {
  params: Joi.object().keys({
    bandMemberId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBandMember,
  getBandMembers,
  getBandMember,
  updateBandMember,
  deleteBandMember,
};
