/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recordGenreSchema = mongoose.Schema({
    genreId: {
        type: mongoose.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    recordId: {
        type: mongoose.Types.ObjectId,
        ref: 'Record',
        required: true        
        }
    },
    {
    timestamps: true,   
    }
)
    
recordGenreSchema.plugin(toJSON);
recordGenreSchema.plugin(paginate);

recordGenreSchema.index({ genreId : 1, recordId: 1 }, {unique: true})

const RecordGenre = mongoose.model('RecordGenre', recordGenreSchema);

module.exports = RecordGenre;