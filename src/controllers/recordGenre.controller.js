const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recordGenreService, genreService, recordService } = require('../services');

const createRecordGenre = catchAsync(async (req, res) => {
  const { genreId, recordId } = req.body;
  const genre = await genreService.getGenreById(genreId);
  const record = await recordService.getRecordById(recordId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre not found');
  } else if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');
  } else {
    const recordGenre = await recordGenreService.createRecordGenre(req.body);
    res.status(httpStatus.CREATED).send(recordGenre);
  }
});

const getRecordGenres = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['genreId', 'recordId']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await recordGenreService.queryRecordGenres(filter, options);
  res.send(result);
});

const getRecordGenre = catchAsync(async (req, res) => {
  const recordGenre = await recordGenreService.getRecordGenreById(req.params.recordGenreId);
  if (!recordGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Genre/Record not found');
  }
  res.send(recordGenre);
});

const updateRecordGenre = catchAsync(async (req, res) => {
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
  const recordGenre = await recordGenreService.updateRecordGenreById(req.params.recordGenreId, req.body);
  res.send(recordGenre);
});

const deleteRecordGenre = catchAsync(async (req, res) => {
  await recordGenreService.deleteRecordGenreById(req.params.recordGenreId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRecordGenre,
  getRecordGenres,
  getRecordGenre,
  updateRecordGenre,
  deleteRecordGenre,
};
