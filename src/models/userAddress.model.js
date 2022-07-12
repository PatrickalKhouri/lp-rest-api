/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { states } = require('../config/states');
const { countriesLong } = require('../config/countries');

const userAddressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
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
  compelement: {
    type: String,
    trim: true,z
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
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

const UserAddress = mongoose.model('User', userAddressSchema);

module.exports = UserAddress;