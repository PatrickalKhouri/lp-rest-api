/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { albumService, recordService, userService, tokenService } = require('../services');

const createUserAddress = catchAsync(async (req, res) => {
  const bodyAlbumUserId = req.body.userId;
  const record = await recordService.getRecordById(req.body.recordId);
  const user = await userService.getUserById(bodyAlbumUserId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create album for non existing user");
  }
  if (!record) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't create an album for non existing record");
  }
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (currentUser.role !== 'admin') {
    if (req.body.userId !== String(currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to create an album for another user');
    } else {
      try {
        const album = await albumService.createUserAddress(req.body);
        res.status(httpStatus.CREATED).send(album);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating album');
      }
    }
  } else {
    try {
      const album = await albumService.createUserAddress(req.body);
      res.status(httpStatus.CREATED).send(album);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating album');
    }
  }
});

const getAlbums = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'recordId', 'stock', 'format', 'description', 'year', 'new', 'price', 'format']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await albumService.queryAlbums(filter, options);
  res.send(result);
});

module.exports = {
  createUserAddress,
  getAlbums,
};
