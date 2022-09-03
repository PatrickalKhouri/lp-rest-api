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
  buildingNumber: {
    type: String,
    required: true,
    trim: true,
  },
  apartmentNumber: {
    type: String,
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

userAddressSchema.index({
  userId : 1,
  streetName: 1,
  buildingNumber: 1,
  apartmentNumber: 1,
  complement: 1,
  postalCode: 1,
  city: 1,
  state: 1,
  country: 1
}, {unique: true})

const UserAddress = mongoose.model('UserAddress', userAddressSchema);

module.exports = UserAddress;