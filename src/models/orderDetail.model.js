/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { OrderItem } = require('./orderItem.model');
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

orderDetailSchema.pre('remove', function(next) {
    OrderItem.remove({ OrderDetailId: this._id }).exec();
    next();
  });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;