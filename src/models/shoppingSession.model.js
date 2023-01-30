/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { CartItem } = require('.');
const { toJSON, paginate } = require('./plugins');

const shoppingSessionSchema = mongoose.Schema({
  userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  total: {
    type: Number,
    min: 0,
    required: true,
  },
  },
  {
    timestamps: true,
  }
)

shoppingSessionSchema.plugin(toJSON);
shoppingSessionSchema.plugin(paginate);

shoppingSessionSchema.pre('remove', async function(next) {
  CartItem.remove({ shoppingSessionId: this._id }).exec();
  next();
});

const ShoppingSession = mongoose.model('shoppingSession', shoppingSessionSchema);

module.exports = ShoppingSession;