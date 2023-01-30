/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cartItemSchema = mongoose.Schema({
    shoppingSessionId: {
        type: mongoose.Types.ObjectId,
        ref: 'ShoppingSession',
        required: true
    },
    albumId: {
        type: mongoose.Types.ObjectId,
        ref: 'Album',
        required: true        
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
        // max - estoque
    }},
    {
    timestamps: true,   
    }
)
    
cartItemSchema.plugin(toJSON);
cartItemSchema.plugin(paginate);

cartItemSchema.index({ shoppingSessionId: 1, albumId: 1}, { unique: true })

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;