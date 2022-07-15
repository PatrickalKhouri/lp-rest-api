/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderDetailsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
        ref: 'UserPayment',
        required: true        
    },
    total : {
        type: Number,
        min: 0
    }
    },
    {
    timestamps: true,   
    }
)
    
orderDetailsSchema.plugin(toJSON);
orderDetailsSchema.plugin(paginate);

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = OrderDetails;