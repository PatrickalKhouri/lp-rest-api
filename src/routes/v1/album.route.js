const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const albumValidation = require('../../validations/album.validation');
const albumController = require('../../controllers/album.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createAlbum'), validate(albumValidation.createAlbum), albumController.createAlbum)
  .get(auth('getAlbums'), validate(albumValidation.getAlbums), albumController.getAlbums);

router
  .route('/:albumId')
  .get(auth('getAlbums'), validate(albumValidation.getAlbum), albumController.getAlbum)
  .patch(auth('manageAlbums'), validate(albumValidation.updateAlbum), albumController.updateAlbum)
  .delete(auth('manageAlbums'), validate(albumValidation.deleteAlbum), albumController.deleteAlbum);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Ablum management and retrieval
 */

/**
 * @swagger
 * /albums:
 *   post:
 *     summary: Creates an album
 *     description: Only admins can create albums for other users.
 *     tags: [Albums]
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
 *               - recordId
 *               - description
 *               - stock
 *               - new
 *               - price
 *               - format
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               recordId:
 *                 type: ObjectId,
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               new:
 *                  type: boolean
 *               year:
 *                  type: number
 *               price:
 *                  type: number
 *               format:
 *                  type: string
 *             example:
 *               id: 63d82f4bc18419431a8e3fea
 *               userId: 5ebac534954b54139806c112
 *               recordId: 635854f8c2c2391300fa85bf
 *               description: fake description
 *               stock: 3
 *               year: 2018
 *               new: true
 *               price: 150
 *               format: Vinyl
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
 *     summary: Get all albums
 *     description: Only admins can retrieve albums.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of that album
 *       - in: query
 *         name: recordId
 *         schema:
 *           type: string
 *         description: The record of the album
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: The description of the album
 *       - in: query
 *         name: stock
 *         schema:
 *           type: number
 *         description: The stock of the album
 *       - in: query
 *         name: new
 *         schema:
 *           type: boolean
 *         description: If the album is new or used
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: The year of the album
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: The price of the album
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: The format of the album
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
 *         description: Maximum number of album
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
 * /Albums/{id}:
 *   get:
 *     summary: Gets an album
 *     description: Logged in users can fetch only their own albums. Only admins can fetch other users.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
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
 *     summary: Updates an album
 *     description: Logged in users can only update their own albums. Only admins can update other users albums.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               recordId:
 *                 type: ObjectId,
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               new:
 *                  type: boolean
 *               year:
 *                  type: number
 *               price:
 *                  type: number
 *               format:
 *                  type: string
 *             example:
 *               id: 63d82f4bc18419431a8e3fea
 *               userId: 5ebac534954b54139806c112
 *               recordId: 635854f8c2c2391300fa85bf
 *               description: fake description
 *               stock: 3
 *               year: 2018
 *               new: true
 *               price: 150
 *               format: Vinyl
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
 *   delete:
 *     summary: Deletes an album
 *     description: Logged in users can delete only their albums. Only admins can delete other albums.
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album id
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
