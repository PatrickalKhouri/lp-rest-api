/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderItemSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'OrderDetails',
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
        // max - estoque
    },
    },
    {
    timestamps: true,   
    }
)
    
orderItemSchema.plugin(toJSON);
orderItemSchema.plugin(paginate);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;