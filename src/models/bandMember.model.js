/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bandMemberSchema = mongoose.Schema({
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: true
      },
    personId: {
        type: mongoose.Types.ObjectId,
        ref: 'Person',
        required: true
      }
    },
    {
      timestamps: true,   
    }
  )

bandMemberSchema.plugin(toJSON);
bandMemberSchema.plugin(paginate);

bandMemberSchema.index({ artistId: 1, personId: 1}, { unique: true })

const BandMember = mongoose.model('BandMember', bandMemberSchema);

module.exports = BandMember;