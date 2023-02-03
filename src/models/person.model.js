/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { countriesLong } = require('../config/countries');
const { genders } = require('../config/genders');
const { BandMember } = require('./bandMember.model');

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        min: '1900-01-01',
        max: new Date(),
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
    gender: {
        type: String,
        required: true,
        enum: genders,
	}
    },
    {
    timestamps: true,   
    }
)

personSchema.plugin(toJSON);
personSchema.plugin(paginate);

personSchema.index({name : 1, nationality: 1}, {unique: true})

personSchema.pre('remove', function(next) {
    BandMember.remove({ personId: this._id }).exec();
    next();
});

const Person = mongoose.model('Person', personSchema);


module.exports = Person;