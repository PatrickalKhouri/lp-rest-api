/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const BandMembersSchema = mongoose.Schema({
    bandId: {
        type: mongoose.Types.ObjectId,
        ref: 'Band',
        required: true
      },
    personId: {
        type: mongoose.Types.ObjectId,
        ref: 'Person',
        required: true
      },
})

BandMembersSchema.plugin(toJSON);
BandMembersSchema.plugin(paginate);

const BandMembers = mongoose.model('BandMembers', BandMembersSchema);

module.exports = BandMembers;