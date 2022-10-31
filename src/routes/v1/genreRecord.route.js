const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const genreRecordValidation = require('../../validations/genreRecord.validation');
const genreRecordController = require('../../controllers/genreRecord.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createGenreRecord'),
    validate(genreRecordValidation.createGenreRecord),
    genreRecordValidation.createGenreRecord
  )
  .get(auth('manageGenreRecords'), validate(genreRecordValidation.getGenreRecord), genreRecordController.getGenreRecords);

router
  .route('/:GenreRecordId')
  .get(auth('manageGenreRecords'), validate(genreRecordValidation.getGenreRecord), genreRecordController.getGenreRecord)
  .patch(
    auth('manageGenreRecords'),
    validate(genreRecordValidation.updateGenreRecord),
    genreRecordValidation.updateGenreRecord
  )
  .delete(
    auth('manageGenreRecords'),
    validate(genreRecordValidation.deleteGenreRecord),
    genreRecordValidation.deleteGenreRecord
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: GenreRecords
 *   description: band member management and retrieval
 */

/**
 * @swagger
 * /GenreRecords:
 *   post:
 *     summary: Creates a Band Member
 *     description: Only admins can create Band Members.
 *     tags: [GenreRecords]
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
 *                $ref: '#/components/schemas/GenreRecord'
 *       "400":
 *         $ref: '#/components/responses/DuplicateGenreRecord'
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
 *     tags: [GenreRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: GenreRecord artist
 *       - in: query
 *         name: personId
 *         schema:
 *           type: string
 *         description: GenreRecord person
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
 *                     $ref: '#/components/schemas/GenreRecord'
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
 * /GenreRecords/{id}:
 *   get:
 *     summary: Get an Band Member
 *     description: Only admins can get Band Members.
 *     tags: [GenreRecords]
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
 *                $ref: '#/components/schemas/GenreRecord'
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
 *     tags: [GenreRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GenreRecord id
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
 *                $ref: '#/components/schemas/GenreRecord'
 *       "400":
 *         $ref: '#/components/responses/DuplicateGenreRecord'
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
 *     tags: [GenreRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GenreRecord id
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
