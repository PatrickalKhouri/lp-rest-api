const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const albumValidation = require('../../validations/album.validation');
const albumController = require('../../controllers/album.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createAlbum'), validate(albumValidation.createAlbum), albumController.createAlbum)
  .get(auth('getAlbums'), validate(albumValidation.getAlbums), albumController.getAlbum);

router
  .route('/:albumId')
  .get(auth('getAlbums'), validate(albumValidation.getAlbum), albumController.getAlbum)
  .patch(auth('manageAlbums'), validate(albumValidation.updateAlbum), albumController.updateAlbum)
  .delete(auth('manageAlbums'), validate(albumValidation.deleteAlbum), albumController.deleteAlbum);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Albumes
 *   description: User Address management and retrieval
 */

/**
 * @swagger
 * /usersAddresses:
 *   post:
 *     summary: Create a user address
 *     description: Only admins can create for other users.
 *     tags: [Albumes]
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
 *               - buildingNumber
 *               - postalCode
 *               - city
 *               - state
 *               - country
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               streetName:
 *                 type: string
 *               buildingNumber:
 *                 type: string
 *               apartmentNumber:
 *                 type: string
 *               complement:
 *                  type: string
 *               postalCode:
 *                  type: string
 *                  format: Brazilian postal code
 *               city:
 *                  type: string
 *               state:
 *                  type: string
 *                  description: Brazilian states UFs
 *               country:
 *                  type: string
 *             example:
 *               userId: 507f191e810c19729de860ea
 *               streetName: 'Fake street name'
 *               buildingNumber: '10'
 *               apartmentNumber: '10'
 *               postalCode: '22222-222'
 *               city: 'Rio de Janeiro'
 *               state: 'RJ'
 *               country: 'Brazil'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Album'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Get all users addresses
 *     description: Only admins can retrieve all users addresses.
 *     tags: [Albumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of that address
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
 *                     $ref: '#/components/schemas/Album'
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
 * /Albumes/{id}:
 *   get:
 *     summary: Get a user address
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Albumes]
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
 *                $ref: '#/components/schemas/Album'
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
 *     tags: [Albumes]
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
 *               buildingNumber:
 *                 type: string
 *               complement:
 *                  type: string
 *               postalCode:
 *                  type: string
 *                  format: Brazilian postal code
 *               city:
 *                  type: string
 *               state:
 *                  type: string
 *                  description: Brazilian states UFs
 *               country:
 *                  type: string
 *             example:
 *               userId: 507f191e810c19729de860ea
 *               streetName: 'Fake street name'
 *               buildingNumber: '10'
 *               apartmentNumber: '201A'
 *               complement: 'Block 2'
 *               postalCode: '22222-222'
 *               city: 'Rio de Janeiro'
 *               state: 'RJ'
 *               country: 'Brazil'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Album'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   delete:
 *     summary: Delete a user address
 *     description: Logged in users can delete only their user addresses. Only admins can delete other user addresses.
 *     tags: [Albumes]
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
