/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const BandMemberSchema = mongoose.Schema({
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: true
      },
    personId: {
        type: mongoose.Types.ObjectId,
        ref: 'Person',
        required: true
      },
})

BandMemberSchema.plugin(toJSON);
BandMemberSchema.plugin(paginate);

const BandMember = mongoose.model('BandMembers', BandMemberSchema);

module.exports = BandMember;