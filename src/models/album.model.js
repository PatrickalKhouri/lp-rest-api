/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { albumTypes } = require('../config/albumTypes');

const albumSchema = mongoose.Schema({
	userId: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true
	},
	recordId: {
		type: mongoose.Types.ObjectId,
		ref: 'Record',
		required: true
	},
	description: {
		type: String,
		required: true,
		min: 10,
		max: 2000
	},
	stock: {
		type: Number,
		min: 0,
		required: true,
	},
	year: {
		type: Number,
		min: 1800,
		max: new Date().getFullYear()
	},
	new: {
		type: Boolean,
		required: true
	},
	price: {
		type: Number,
		min: 0,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: albumTypes
	}
	},
	{
    timestamps: true,   
  	},
)

albumSchema.plugin(toJSON);
albumSchema.plugin(paginate);

albumSchema.index({
	userId : 1,
	recordId: 1,
	year: 1,
	new: 1,
  }, {unique: true})

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;