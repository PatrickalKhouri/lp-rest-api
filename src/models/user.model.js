const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { OrderItem } = require('./orderItem.model');
const { CartItem } = require('./cartItem.model');
const { Album } = require('./album.model');
const { OrderDetail } = require('./orderDetail.model');
const { ShoppingSession } = require('./shoppingSession.model');
const { UserPayment } = require('./userPayment.model');
const { UserAddress } = require('./userAddress.model');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email Inválido');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre('remove', async function (next) {
  UserAddress.remove({ userId: this._id }).exec();
  Album.remove({ userId: this._id }).exec();

  const shoppingSessions = await ShoppingSession.find({ userId: this._id });
  ShoppingSession.remove({ userId: this._id }).exec();
  shoppingSessions.forEach(async (shoppingSession) => {
    CartItem.remove({ albumId: shoppingSession._id }).exec();
  });
  const userPayments = await UserPayment.find({ userId: this._id });
  UserPayment.remove({ userId: this._id }).exec();
  userPayments.forEach(async (userPayment) => {
    const orderDetails = await OrderDetail.find({ userPaymentId: userPayment._id });
    OrderDetail.remove({ userPaymentId: userPayment._id }).exec();
    orderDetails.forEach(async (orderDetail) => {
      OrderItem.remove({ orderDetailId: orderDetail._id }).exec();
    });
  });
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
