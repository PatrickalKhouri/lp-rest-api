const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recordService, artistService, labelService } = require('../services');

const createRecord = catchAsync(async (req, res) => {
  const { artistId, labelId } = req.body;
  const artist = await artistService.getArtistById(artistId);
  const label = await labelService.getLabelById(labelId);
  if (!artist || !label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist or Label not found');
  } else {
    const record = await recordService.createRecord(req.body);
    res.status(httpStatus.CREATED).send(record);
  }
});

module.exports = {
  createRecord,
};
