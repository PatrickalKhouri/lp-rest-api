const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userAddressValidation = require('../../validations/userAddress.validation');
const userAddressController = require('../../controllers/userAddress.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createUserAddress'),
    validate(userAddressValidation.createUserAddress),
    userAddressController.createUserAddress
  )
  .get(auth('getUserAddresses'), validate(userAddressValidation.getUserAddresses), userAddressController.getUserAddresses);

router
  .route('/:userAddressId')
  .get(auth('getUserAddress'), validate(userAddressValidation.getUserAddress), userAddressController.getUserAddress)
  .patch(
    auth('manageUserAddresses'),
    validate(userAddressValidation.updateUserAddress),
    userAddressController.updateUserAddress
  )
  .delete(
    auth('manageUserAddresses'),
    validate(userAddressValidation.deleteUserAddress),
    userAddressController.deleteUserAddress
  );

module.exports = router;
