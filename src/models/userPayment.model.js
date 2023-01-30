/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { paymentStrings } = require('../config/paymentTypes');
const { paymentProvidersStrings } = require('../config/paymentProviders');
const { OrderDetail, OrderItem } = require('./index');

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

userPaymentSchema.pre('remove', async function(next) {
  const orderDetails = await OrderDetail.find({userPaymentId: this._id});
  OrderDetail.remove({ userPaymentId: this._id }).exec();
  orderDetails.forEach(async (orderDetail) => {
    OrderItem.remove({ orderDetailId: orderDetail._id }).exec();
})
  next();
});

const UserPayment = mongoose.model('UserPayment', userPaymentSchema);

module.exports = UserPayment;