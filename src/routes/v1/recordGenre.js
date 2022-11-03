/* eslint-disable prettier/prettier */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recordGenreValidation = require('../../validations/recordGenre.validation');
const recordGenreController = require('../../controllers/recordGenre.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createRecordGenre'), validate(recordGenreValidation.createRecordGenre), recordGenreController.createRecordGenre)
  .get(auth('manageRecordGenres'), validate(recordGenreValidation.getRecordGenre), recordGenreController.getRecordGenres);

router
  .route('/:recordId')
  .get(auth('manageRecordGenres'), validate(recordGenreValidation.getRecordGenre), recordGenreController.getRecordGenre)
  .patch(auth('manageRecordGenres'), validate(recordGenreValidation.updateRecordGenre), recordGenreController.updateRecordGenre)
  .delete(auth('manageRecordGenres'), validate(recordGenreValidation.deleteRecordGenre), recordGenreController.deleteRecordGenre);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: recordGenres
 *   description: band member management and retrieval
 */

/**
 * @swagger
 * /recordGenres:
 *   post:
 *     summary: Creates a Band Member
 *     description: Only admins can create Band Members.
 *     tags: [recordGenres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistId
 *               - personId
 *             properties:
 *               artistid:
 *                 type: string
 *               personId:
 *                 type: string
 *             example:
 *               artistid: 63322dda8f9d0fe821b20b21
 *               personId: 632f4301b7018f1243894fed
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/recordGenre'
 *       "400":
 *         $ref: '#/components/responses/DuplicaterecordGenre'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all Band Members
 *     description: Only admins can retrieve all Band Members.
 *     tags: [recordGenres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: recordGenre artist
 *       - in: query
 *         name: personId
 *         schema:
 *           type: string
 *         description: recordGenre person
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of band members
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
 *                     $ref: '#/components/schemas/recordGenre'
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
 * /recordGenres/{id}:
 *   get:
 *     summary: Get an Band Member
 *     description: Only admins can get Band Members.
 *     tags: [recordGenres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Band Member id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/recordGenre'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Band Member
 *     description: Only admins can update Band Members.
 *     tags: [recordGenres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: recordGenre id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *               personId:
 *                 type: string
 *             example:
 *               artistId: 6340962762b0158e1b0473a6
 *               personId: 6340962b530b24897ba0f06d
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/recordGenre'
 *       "400":
 *         $ref: '#/components/responses/DuplicaterecordGenre'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a Band Member
 *     description: Only admins can delete Band Members.
 *     tags: [recordGenres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: recordGenre id
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
