/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { albumService, recordService, userService, tokenService } = require('../services');

const createAlbum = catchAsync(async (req, res) => {
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
        const album = await albumService.createAlbum(req.body);
        res.status(httpStatus.CREATED).send(album);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating album');
      }
    }
  } else {
    try {
      const album = await albumService.createAlbum(req.body);
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

const getAlbum = catchAsync(async (req, res) => {
  const album = await albumService.getAlbumById(req.params.albumId);
  if (!album) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Album not found');
  }
  res.send(album);
});

const updateAlbum = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  if (req.body.userId) {
    const user = await userService.getUserById(req.body.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User to update not found');
    }
  }
  if (req.body.recordId) {
    const record = await recordService.getRecordById(req.body.recordId);
    if (!record) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Can't create an album for non existing record");
    }
  }
  const albumToUpdate = await albumService.getAlbumById(req.params.albumId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(albumToUpdate.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to update an album for another user');
    } else {
      try {
        const album = await albumService.updateAlbumById(req.params.albumId, req.body);
        res.send(album);
      } catch (e) {
        console.log(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating album');
      }
    }
  } else {
    try {
      const album = await albumService.updateAlbumById(req.params.albumId, req.body);
      res.send(album);
    } catch (e) {
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when creating album');
    }
  }
});

const deleteAlbum = catchAsync(async (req, res) => {
  const currentUser = await tokenService.getCurrentUserFromReq(req);
  const albumToDelete = await albumService.getAlbumById(req.params.albumId);
  if (currentUser.role !== 'admin') {
    if (String(currentUser._id) !== String(albumToDelete.userId)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not allowed to delete an album for another user');
    } else {
      await albumService.deleteAlbumById(req.params.albumId);
      res.status(httpStatus.NO_CONTENT).send();
    }
  } else {
    await albumService.deleteAlbumById(req.params.albumId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

module.exports = {
  createAlbum,
  getAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
};
