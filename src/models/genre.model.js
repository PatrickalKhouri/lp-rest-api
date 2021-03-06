/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { allMusicGenres } = require('../config/musicGenres');

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: allMusicGenres,
	}
    },
    {
    timestamps: true,   
    }
)
    
genreSchema.plugin(toJSON);
genreSchema.plugin(paginate);

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;