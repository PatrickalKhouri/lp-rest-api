/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');

const LabelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        enum: countriesLong,        
    }
})
    
LabelSchema.plugin(toJSON);
LabelSchema.plugin(paginate);

const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;