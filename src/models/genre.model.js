/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { allMusicGenres } = require('../config/musicGenres');
const { RecordGenre } = require('./index');

const genreSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      enum: allMusicGenres,
      unique: true,
    },
    },
    {
    timestamps: true,
  });
    
genreSchema.plugin(toJSON);
genreSchema.plugin(paginate);

genreSchema.pre('remove', async function(next) {
  RecordGenre.remove({ genreId: this._id }).exec();
  next();
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;