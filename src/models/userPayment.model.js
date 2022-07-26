/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { paymentStrings } = require('../config/paymentTypes');
const { paymentProvidersStrings } = require('../config/paymentProviders');

const userPaymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  paymentType: {
    type: String,
    enum: paymentStrings,
    required: true,
    trim: true,
  },
  provider: {
    type: String,
    enum: paymentProvidersStrings,
    trim: true,
	}
  },
  {
    timestamps: true,   
  }
)

userPaymentSchema.plugin(toJSON);
userPaymentSchema.plugin(paginate);

userPaymentSchema.index({accountNumber : 1, provider: 1}, {unique: true})

const UserPayment = mongoose.model('User', userPaymentSchema);

module.exports = UserPayment;