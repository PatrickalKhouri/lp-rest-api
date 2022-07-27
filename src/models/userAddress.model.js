/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { states } = require('../config/states');
const { countriesLong } = require('../config/countries');

const userAddressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  streetName: {
    type: String,
    required: true,
    trim: true,
  },
  streetNumber: {
    type: String,
    required: true,
    trim: true,
  },
  complement: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!value.match(/^[0-9]{5}-[0-9]{3}$/)) {
        throw new Error('CEP Inválido');
      }
    },
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    enum: states,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    enum: countriesLong,
    trim: true,
  },
	},
  {
  timestamps: true,
});

userAddressSchema.plugin(toJSON);
userAddressSchema.plugin(paginate);

const UserAddress = mongoose.model('UserAddress', userAddressSchema);

module.exports = UserAddress;