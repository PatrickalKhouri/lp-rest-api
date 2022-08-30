const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userAddressService } = require('../services');

const createUserAddress = catchAsync(async (req, res) => {
  // pegar o id do usuario e passar para a criação do usuario.
  const userAddress = await userAddressService.createUserAddress(req.body);
  res.status(httpStatus.CREATED).send(userAddress);
});

module.exports = {
  createUserAddress,
};