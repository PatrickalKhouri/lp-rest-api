const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const labelValidation = require('../../validations/label.validation');
const labelController = require('../../controllers/label.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createLabel'), validate(labelValidation.createLabel), labelController.createLabel)
  .get(auth('manageLabel'), validate(labelValidation.getLabels), labelController.getLabels);

router
  .route('/:labelId')
  .get(auth('manageLabel'), validate(labelValidation.getLabel), labelController.getLabel)
  .patch(auth('manageLabel'), validate(labelValidation.updateLabel), labelController.updateLabel)
  .delete(auth('manageLabel'), validate(labelValidation.deleteLabel), labelController.deleteLabel);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Label
 *   description: Label management and retrieval
 */

// /**
//  * @swagger
//  * /labels:
//  *   post:
//  *     summary: Create a label
//  *     description: Only admins can create label.
//  *     tags: [Labels]
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
//  *               country:
//  *                 type: string
//  *             example:
//  *               name: 'Universal'
//  *               country: 'United States of America'
//  *     responses:
//  *       "201":
//  *         description: Created
//  *         content:
//  *           application/json:
//  *             schema:
//  *                $ref: '#/components/schemas/Label'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "500":
//  *         $ref: '#/components/responses/InternalServerError'
//  *
//  *   get:
//  *     summary: Get all labels
//  *     description: Only admins can retrieve all labels.
//  *     tags: [Labels]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: country
//  *         schema:
//  *           type: string
//  *         description: All the lablels of a country
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
//  *         description: Maximum number of user addreses
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
//  *                     $ref: '#/components/schemas/Label'
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
 *     summary: Get a label
 *     description: Only admins can fetch a label.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Label id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Label'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a label
 *     description: Only admins can update labels.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Label id
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
 *               country:
 *                  type: string
 *                  description: only admins can update country
 *             example:
 *               name: 'Universal Brasil'
 *               country: 'Brazil'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Label'
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
 *     summary: Delete a label
 *     description: Only admins can delete other labels.
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Label id
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
