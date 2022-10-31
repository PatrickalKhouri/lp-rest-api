const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { genreRecordService, genreService, recordService } = require('../services');

const createGenreRecord = catchAsync(async (req, res) => {
  const { genreId, recordId } = req.body;
  const genre = await genreService.getGenreById(genreId);
  const record = await recordService.getRecordById(recordId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  } else if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');
  } else {
    const genreRecord = await genreRecordService.createGenreRecord(req.body);
    res.status(httpStatus.CREATED).send(genreRecord);
  }
});

const getGenreRecords = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['genreId', 'recordId']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await genreRecordService.queryGenreRecords(filter, options);
  res.send(result);
});

const getGenreRecord = catchAsync(async (req, res) => {
  const genreRecord = await genreRecordService.getGenreRecordById(req.params.genreRecordId);
  if (!genreRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre/Record not found');
  }
  res.send(genreRecord);
});

const updateGenreRecord = catchAsync(async (req, res) => {
  if (req.body.genreId) {
    const { genreId } = req.body;
    const genre = await genreService.getGenreById(genreId);
    if (!genre) {
      throw new ApiError(httpStatus.NOT_FOUND, 'genre not found');
    }
  }
  if (req.body.recordId) {
    const { recordId } = req.body;
    const record = await recordService.getRecordById(recordId);
    if (!record) {
      throw new ApiError(httpStatus.NOT_FOUND, 'record not found');
    }
  }
  const genreRecord = await genreRecordService.updateGenreRecordById(req.params.genreRecordId, req.body);
  res.send(genreRecord);
});

const deleteGenreRecord = catchAsync(async (req, res) => {
  await genreRecordService.deleteGenreRecordById(req.params.genreRecordId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGenreRecord,
  getGenreRecords,
  getGenreRecord,
  updateGenreRecord,
  deleteGenreRecord,
};
