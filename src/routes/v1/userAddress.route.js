const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userAddressValidation = require('../../validations/userAddress.validation');
const userAddressController = require('../../controllers/userAddress.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageUserAddresses'),
    validate(userAddressValidation.createUserAddress),
    userAddressController.createUserAddress
  )
  .get(auth('getUserAddressess'), validate(userAddressValidation.getUserAddresses), userAddressController.getUserAddresses);

router
  .route('/:userAddressId')
  .get(auth('getUsersAddresses'), validate(userAddressValidation.getUserAddress), userAddressController.getUserAddress)
  .patch(auth('manageUserAddresses'), validate(userAddressValidation.updateUser), userAddressController.updateUserAddress)
  .delete(auth('manageUsersAddresses'), validate(userAddressValidation.deleteUser), userAddressController.deleteUserAddress);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User Addresses
 *   description: User Address management and retrieval
 */

/**
 * @swagger
 * /usersAddress:
 *   post:
 *     summary: Create a user address
 *     description: Only admins can create for other users.
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - streetName
 *               - streetNumber
 *               - postalCode
 *               - city
 *               - state
 *              - country
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               streetName:
 *                 type: string
 *               streetNumber:
 *                 type: string
 *               complement:
 *                  type: string
 *              postalCode:
 *                  type: string
 *                  format: Brazilian postal code
 *              city:
 *                  type: string
 *              state:
 *                  type: string
 *                  description: Brazilian states UFs
 *              country:
 *                  type: string
 *             example:
 *               userId: 1sdfsa1114198aisdmklgmf3
 *               streetName: 'Fake street name'
 *               streetNumber: '10'
 *               complement: 'Block 2'
 *               postalCode: '22222-222'
 *               city: 'Rio de Janeiro'
 *               state: 'RJ'
 *               country: 'Brazil
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAddress'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all users addresses
 *     description: Only admins can retrieve all users addresses.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of that address
 *       - in: query
 *         name: streetName
 *         schema:
 *           type: string
 *         description: The name of the street
 *       - in: query
 *         name: streetNumber
 *         schema:
 *           type: string
 *         description: The number of the building in the street
 *       - in: query
 *         name: complement
 *         schema:
 *           type: string
 *         description: Any other information
 *       - in: query
 *         name: postalCode
 *         schema:
 *           type: string
 *         description: The postal code of the address
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: The city of the address
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: The state of the address
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: The country of the address
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of user addreses
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAddress'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user address
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Address id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAddress'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a user address
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Address id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: objectId
 *                 description: only admins can update userId
 *               streetName:
 *                 type: string
 *               streetNumber:
 *                 type: string
 *               complement:
 *                  type: string
 *              postalCode:
 *                  type: string
 *                  format: Brazilian postal code
 *              city:
 *                  type: string
 *              state:
 *                  type: string
 *                  description: Brazilian states UFs
 *              country:
 *                  type: string
 *             example:
 *               userId: 1sdfsa1114198aisdmklgmf3
 *               streetName: 'Fake street name'
 *               streetNumber: '10'
 *               complement: 'Block 2'
 *               postalCode: '22222-222'
 *               city: 'Rio de Janeiro'
 *               state: 'RJ'
 *               country: 'Brazil
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAddress'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Address id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
