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

const BandMember = mongoose.model('BandMembers', bandMemberSchema);

module.exports = BandMember;