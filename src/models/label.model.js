/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { Artist, BandMember, Record, Album, CartItem, OrderItem} = require('./index');

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

labelSchema.pre('remove', async function(next) {
    const artists = await Artist.find({labelId: this._id});
    const records = await Record.find({labelId: this._id});

    Artist.remove({ labelId: this._id }).exec();
    Record.remove({ labelId: this._id }).exec();
    artists.forEach((artist) => {
        BandMember.remove({ artistId: artist._id }).exec();
    })
    records.forEach(async (record) => {
        const albums = await Album.find({recordId: record._id});
        Album.remove({ recordId: record._id }).exec();
        albums.forEach(async (album) => {
            CartItem.remove({ albumId: album._id }).exec();
            OrderItem.remove({ albumId: album._id }).exec();
        })
    })
    next();
});

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;