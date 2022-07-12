/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { humanGenres } = require('../config/humanGenres');

const PersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: String,
    },
    alive: {
        type: Boolean,
        required: true
    },
    nationality: {
        type: String,
        required: true,
        enum: countriesLong,
        trim: true,
    },
    humanGenre: {
        type: String,
        required: true,
        enum: humanGenres,
    }
})

PersonSchema.plugin(toJSON);
PersonSchema.plugin(paginate);

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;