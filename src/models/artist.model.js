/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');

const ArtistSchema = mongoose.Schema({
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

ArtistSchema.plugin(toJSON);
ArtistSchema.plugin(paginate);

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;