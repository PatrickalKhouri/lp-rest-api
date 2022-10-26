const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recordValidation = require('../../validations/record.validation');
const recordController = require('../../controllers/record.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createRecord'), validate(recordValidation.createRecord), recordController.createRecord)
  .get(auth('manageRecords'), validate(recordValidation.getRecords), recordController.getRecords);

router
  .route('/:recordId')
  .get(auth('manageRecords'), validate(recordValidation.getRecord), recordController.getRecord)
  .patch(auth('manageRecords'), validate(recordValidation.updateRecord), recordController.updateRecord)
  .delete(auth('manageRecords'), validate(recordValidation.deleteRecord), recordController.deleteRecord);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: record management and retrieval
 */

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Creates a record
 *     description: Only admins can create records.
 *     tags: [Records]
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
 *               - labelId
 *               - releaseYear
 *               - country
 *               - duration
 *               - language
 *               - numberOfTracks
 *               - recordType
 *             properties:
 *               artistId:
 *                 type: string
 *               labelId:
 *                 type: string
 *               releaseYear:
 *                 type: number
 *               country:
 *                  type: string
 *               duration:
 *                 type: string
 *               language:
 *                 type: string
 *               numberOfTracks:
 *                 type: number
 *               recordType:
 *                 type: string
 *             example:
 *               artistId: 635851ec18cc5390e4f0c42e
 *               labelId: 635851f3b8d73a3fb4b89997
 *               releaseYear: 2003
 *               duration: 42:15
 *               language: Japanese
 *               country: Japan
 *               numberOfTracks: 15
 *               recordType: LP
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/record'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRecord'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all records
 *     description: Only admins can retrieve all records.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: artist Id
 *       - in: query
 *         name: labelId
 *         schema:
 *           type: string
 *         description: record label id
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: number
 *         description: record release year
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: record duration
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: record language
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: record country
 *       - in: query
 *         name: numberOfTracks
 *         schema:
 *           type: number
 *         description: record number of tracks
 *       - in: query
 *         name: recordType
 *         schema:
 *           type: string
 *         description: record type
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
 *         description: Maximum number of records
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
 *                     $ref: '#/components/schemas/record'
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
 * /records/{id}:
 *   get:
 *     summary: Get a record
 *     description: Only admins can get records.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: record id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/record'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a record
 *     description: Only admins can update records.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: record id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistId:
 *                 type: string
 *               labelId:
 *                 type: string
 *               releaseYear:
 *                 type: number
 *               country:
 *                  type: string
 *               duration:
 *                 type: string
 *               language:
 *                 type: string
 *               numberOfTracks:
 *                 type: number
 *               recordType:
 *                 type: string
 *             example:
 *               name: fake record name
 *               country: Brazil
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/record'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRecord'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a record
 *     description: Only admins can delete records.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: record id
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
