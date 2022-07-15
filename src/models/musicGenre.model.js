/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { allMusicGenres } = require('../config/musicGenres');

const musicGenreSchema = mongoose.Schema({
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
    
musicGenreSchema.plugin(toJSON);
musicGenreSchema.plugin(paginate);

const MusicGenre = mongoose.model('MusicGenre', musicGenreSchema);

module.exports = MusicGenre;