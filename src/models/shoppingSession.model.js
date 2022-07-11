/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
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
})

shoppingSessionSchema.plugin(toJSON);
shoppingSessionSchema.plugin(paginate);

const ShoppingSession = mongoose.model('shoppingSession', shoppingSessionSchema);

module.exports = ShoppingSession;