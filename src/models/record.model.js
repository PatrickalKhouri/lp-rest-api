/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { languages } = require('../config/languages');
const { albumTypesString } = require('../config/albumTypes');
const { RecordGenre, Album, CartItem, OrderItem } = require('./index');

const recordSchema = mongoose.Schema({
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: true
      },
    labelId: {
        type: mongoose.Types.ObjectId,
        ref: 'Label',
        required: true
      },
    name: {
        type: String,
        required: true,
        trim: true
    },
    releaseYear: {
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
        type: String,
        required: true,
        validate(value) {
            if (!value.match(/^(([0-9]?[0-9][0-9]|[0-9]):([0-5][0-9]))$/)) {
              throw new Error('Duração está com o formato inválido');
            }
        },
    },
    language: {
        type: String,
        required: true,
        enum : languages,
    },
    recordType: {
        type: String,
        required: true,
        enum: albumTypesString
    },
    numberOfTracks: {
        type: Number,
        required: true,
        min: 1
        }
    },
    {
    timestamps: true,   
    }
)
    
recordSchema.plugin(toJSON);
recordSchema.plugin(paginate);

recordSchema.index({
	artistId : 1,
	name: 1,
	releaseYear: 1,
	duration: 1,
    numberOfTracks: 1
  }, {unique: true})

recordSchema.pre('remove', async function(next) {
    const albums = await Album.find({recordId: this._id});
    RecordGenre.remove({ recordId: this._id }).exec();
    Album.remove({ recordId: this._id }).exec();
    albums.forEach(async (album) => {
        CartItem.remove({ albumId: album._id }).exec();
        OrderItem.remove({ albumId: album._id }).exec();
    })
    next();
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;