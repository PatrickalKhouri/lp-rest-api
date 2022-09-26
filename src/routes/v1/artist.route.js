const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const artistValidation = require('../../validations/artist.validation');
const artistController = require('../../controllers/artist.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createArtist'), validate(artistValidation.createArtist), artistController.createArtist)
  .get(auth('manageArtists'), validate(artistValidation.getArtist), artistController.getArtist);

router
  .route('/:artistId')
  .get(auth('manageArtists'), validate(artistValidation.getArtist), artistController.getArtist)
//   .patch(auth('manageArtists'), validate(artistValidation.updateArtist), artistController.updateArtist)
//   .delete(auth('manageArtists'), validate(artistValidation.deleteArtist), artistController.deleteArtist);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Artist management and retrieval
 */

/**
 * @swagger
 * /artists:
 *   post:
 *     summary: Creates an artists
 *     description: Only admins can create artists.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - labelId
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               labelId:
 *                 type: string
 *             example:
 *               labelId: 63322babc8c8998afbdc9bf0
 *               name: Fake Band
 *               country: Germany
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/artist'
 *       "400":
 *         $ref: '#/components/responses/DuplicateArtist'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all artists
 *     description: Only admins can retrieve all artists.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: artist name
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: artist country
 *       - in: query
 *         name: labelId
 *         schema:
 *           type: string
 *         description: artist label id
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
 *         description: Maximum number of artists
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
 *                     $ref: '#/components/schemas/artist'
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
 * /artists/{id}:
 *   get:
 *     summary: Get an artist
 *     description: Only admins can get artists.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: artist id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/artist'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a artist
 *     description: Only admins can update artists.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: artist id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               labelId:
 *                 type: string
 *             example:
 *               name: fake artist name
 *               country: Brazil
 *               labelId: 63322c325148bff009fc0971
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/artist'
 *       "400":
 *         $ref: '#/components/responses/DuplicateArtist'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a artist
 *     description: Only admins can delete artists.
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: artist id
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
