/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { humanGenres } = require('../config/humanGenres');

const personSchema = mongoose.Schema({
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
    },
    humanGenre: {
        type: String,
        required: true,
        enum: humanGenres,
	}
    },
    {
    timestamps: true,   
    }
)

personSchema.plugin(toJSON);
personSchema.plugin(paginate);

const Person = mongoose.model('Person', personSchema);

module.exports = Person;