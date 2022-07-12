/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { allMusicGenres } = require('../config/musicGenres');

const MusicGenreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: allMusicGenres,
    },
})
    
MusicGenreSchema.plugin(toJSON);
MusicGenreSchema.plugin(paginate);

const MusicGenre = mongoose.model('MusicGenre', MusicGenreSchema);

module.exports = MusicGenre;