const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bandMemberService, artistService, personService } = require('../services');

const createBandMember = catchAsync(async (req, res) => {
  const { artistId, personId } = req.body;
  const artist = await artistService.getArtistById(artistId);
  const person = await personService.getPersonById(personId);
  if (!artist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
  } else if (!person) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
  } else {
    const bandMember = await bandMemberService.createBandMember(req.body);
    res.status(httpStatus.CREATED).send(bandMember);
  }
});

const getBandMembers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['artistId', 'personId']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await bandMemberService.queryBandMembers(filter, options);
  res.send(result);
});

const getBandMember = catchAsync(async (req, res) => {
  const bandMember = await bandMemberService.getBandMemberById(req.params.bandMemberId);
  if (!bandMember) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Band Member not found');
  }
  res.send(bandMember);
});

const updateBandMember = catchAsync(async (req, res) => {
  if (req.body.artistId) {
    const { artistId } = req.body;
    const artist = await artistService.getArtistById(artistId);
    if (!artist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
    }
  }
  if (req.body.personId) {
    const { personId } = req.body;
    const person = await personService.getPersonById(personId);
    if (!person) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
    }
  }
  const bandMember = await bandMemberService.updateBandMemberById(req.params.bandMemberId, req.body);
  res.send(bandMember);
});

const deleteBandMember = catchAsync(async (req, res) => {
  await bandMemberService.deleteBandMemberById(req.params.bandMemberId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBandMember,
  getBandMembers,
  getBandMember,
  updateBandMember,
  deleteBandMember,
};
