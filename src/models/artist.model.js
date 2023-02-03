/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { BandMember } = require('./bandMember.model');

const artistSchema = mongoose.Schema({
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
	}
    },
    {
    timestamps: true,   
    }
)

artistSchema.plugin(toJSON);
artistSchema.plugin(paginate);

artistSchema.index({ name: 1, country: 1}, { unique: true })

artistSchema.pre('remove', function(next) {
    BandMember.remove({ artistId: this._id }).exec();
    next();
});
const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;