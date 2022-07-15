/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');

const labelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        enum: countriesLong,        
	}
},
{
timestamps: true,   
}
)
    
labelSchema.plugin(toJSON);
labelSchema.plugin(paginate);

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;