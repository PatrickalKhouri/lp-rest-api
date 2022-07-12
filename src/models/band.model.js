/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');

const BandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        enum: countriesLong,        
    },
    labelId: {
        type: mongoose.Types.ObjectId,
        ref: 'Label',
      },
})
    
BandSchema.plugin(toJSON);
BandSchema.plugin(paginate);

const Band = mongoose.model('Band', BandSchema);

module.exports = Band;