/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { languages } = require('../config/languages');

const RecordSchema = mongoose.Schema({
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: true
      },
    name: {
        type: String,
        required: true,
        trim: true
    },
    release_year: {
        type: Number,
        required: true,
        min: 1800,
        max: new Date().getFullYear()
    },
    country: {
        type: String,
        enum: countriesLong,        
    },
    duration: {
        type: Date,
        required: true,
        min: 0
    },
    language: {
        type: String,
        required: true,
        enum : languages,
    },
    numberOfTracks: {
        type: Number,
        required: true,
        min: 0
    }
})
    
RecordSchema.plugin(toJSON);
RecordSchema.plugin(paginate);

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;