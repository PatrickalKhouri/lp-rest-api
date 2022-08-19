const mongoose = require('mongoose');
const BandMember = require('../../src/models/bandMember.model');
const { artistOne, artistTwo } = require('./artist.fixture');
const { personOne, personTwo } = require('./person.fixture');

const bandMemberOne = {
  _id: mongoose.Types.ObjectId(),
  artistId: artistOne._id,
  personId: personOne._id,
};

const bandMemberTwo = {
  _id: mongoose.Types.ObjectId(),
  artistId: artistTwo._id,
  personId: personTwo._id,
};

const insertBandMembers = async (bandMembers) => {
  await BandMember.insertMany(bandMembers.map((bandMember) => ({ ...bandMember })));
};

module.exports = {
  bandMemberOne,
  bandMemberTwo,
  insertBandMembers,
};
