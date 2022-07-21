/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderItemsSchema = mongoose.Schema({
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
    
orderItemsSchema.plugin(toJSON);
orderItemsSchema.plugin(paginate);

const OrderItems = mongoose.model('OrderItems', orderItemsSchema);

module.exports = OrderItems;