const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recordService, artistService, labelService } = require('../services');

const createRecord = catchAsync(async (req, res) => {
  const { artistId, labelId } = req.body;
  const artist = await artistService.getArtistById(artistId);
  const label = await labelService.getLabelById(labelId);
  if (!artist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Artist not found');
  } else if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  } else {
    console.log('entrou no else');
    const record = await recordService.createRecord(req.body);
    res.status(httpStatus.CREATED).send(record);
  }
});

const getRecords = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'artistId',
    'labelId',
    'releaseYear',
    'country',
    'duration',
    'language',
    'numberOfTracks',
    'recordType',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await recordService.queryRecords(filter, options);
  res.send(result);
});

const getRecord = catchAsync(async (req, res) => {
  const record = await recordService.getRecordById(req.params.recordId);
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');
  }
  res.send(record);
});

const updateRecord = catchAsync(async (req, res) => {
  const record = await recordService.updateRecordById(req.params.recordId, req.body);
  res.send(record);
});

const deleteRecord = catchAsync(async (req, res) => {
  await recordService.deleteRecordById(req.params.recordId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
};
