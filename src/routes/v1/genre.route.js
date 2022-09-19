const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const genreValidation = require('../../validations/genre.validation');
const genreController = require('../../controllers/genre.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createGenre'), validate(genreValidation.createGenre), genreController.createGenre)
  .get(auth('manageGenre'), validate(genreValidation.getGenres), genreController.getGenres);

router
  .route('/:genreId')
  .get(auth('manageGenre'), validate(genreValidation.getGenre), genreController.getGenre)
  .patch(auth('manageGenre'), validate(genreValidation.updateGenre), genreController.updateGenre)
  .delete(auth('manageGenre'), validate(genreValidation.deleteGenre), genreController.deleteGenre);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Genre
 *   description: Genre management and retrieval
 */

// /**
//  * @swagger
//  * /genres:
//  *   post:
//  *     summary: Create a genre
//  *     description: Only admins can create genre.
//  *     tags: [genres]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *             properties:
//  *               name:
//  *                 type: string,
//  *             example:
//  *               name: 'Pop'
//  *     responses:
//  *       "201":
//  *         description: Created
//  *         content:
//  *           application/json:
//  *             schema:
//  *                $ref: '#/components/schemas/genre'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "500":
//  *         $ref: '#/components/responses/InternalServerError'
//  *
//  *   get:
//  *     summary: Get all genres
//  *     description: Only admins can retrieve all genres.
//  *     tags: [genres]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: name
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *         description: sort by query in the form of field:desc/asc (ex. name:asc)
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *         default: 10
//  *         description: Maximum number of genres
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           default: 1
//  *         description: Page number
//  *     responses:
//  *       "200":
//  *         description: OK
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 results:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/genre'
//  *                 page:
//  *                   type: integer
//  *                   example: 1
//  *                 limit:
//  *                   type: integer
//  *                   example: 10
//  *                 totalPages:
//  *                   type: integer
//  *                   example: 1
//  *                 totalResults:
//  *                   type: integer
//  *                   example: 1
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a genre
 *     description: Only admins can fetch a genre.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: genre id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/genre'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a genre
 *     description: Only admins can update genres.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: genre id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: only admins can update name
 *             example:
 *               name: 'Punk'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/genre'
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
 *     summary: Delete a genre
 *     description: Only admins can delete other genres.
 *     tags: [genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: genre id
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
