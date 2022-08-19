/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderDetailSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userPaymentId: {
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
    
orderDetailSchema.plugin(toJSON);
orderDetailSchema.plugin(paginate);

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;