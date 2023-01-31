const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { artistService, labelService } = require('../services');

const createArtist = catchAsync(async (req, res) => {
  const { labelId } = req.body;
  const label = await labelService.getLabelById(labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  } else {
    const artist = await artistService.createArtist(req.body);
    res.status(httpStatus.CREATED).send(artist);
  }
});

const getArtists = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'country', 'labelId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await artistService.queryArtists(filter, options);
  res.send(result);
});

const getArtist = catchAsync(async (req, res) => {
  const artist = await artistService.getArtistById(req.params.artistId);
  if (!artist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
  }
  res.send(artist);
});

const updateArtist = catchAsync(async (req, res) => {
  if (req.body.labelId) {
    const { labelId } = req.body;
    const label = await labelService.getLabelById(labelId);
    if (!label) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
    }
  }
  const artist = await artistService.updateArtistById(req.params.artistId, req.body);
  res.send(artist);
});

const deleteArtist = catchAsync(async (req, res) => {
  await artistService.deleteArtistById(req.params.artistId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createArtist,
  getArtists,
  getArtist,
  updateArtist,
  deleteArtist,
};
