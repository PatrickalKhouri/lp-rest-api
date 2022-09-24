const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const personValidation = require('../../validations/person.validation');
const personController = require('../../controllers/person.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createPerson'), validate(personValidation.createPerson), personController.createPerson)
  .get(auth('managePeople'), validate(personValidation.getPeople), personController.getPeople);

router
  .route('/:personId')
  .get(auth('managePeople'), validate(personValidation.getPerson), personController.getPerson)
  .patch(auth('managePeople'), validate(personValidation.updatePerson), personController.updatePerson)
  .delete(auth('managePeople'), validate(personValidation.deletePerson), personController.deletePerson);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: People
 *   description: Person management and retrieval
 */

/**
 * @swagger
 * /people:
 *   post:
 *     summary: Create a person
 *     description: Only admins can create people.
 *     tags: [People]
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
 *               - alive
 *               - gender
 *               - nationality
 *             properties:
 *               name:
 *                 type: string
 *               nationality:
 *                 type: string
 *               dateOfBirth:
 *                 type: date
 *               alive:
 *                 type: boolean
 *               gender:
 *                 type: string
 *             example:
 *               name: person name
 *               nationality: Japan
 *               dateOfBirth: 1977-06-8T00:00:00.002Z
 *               alive: false
 *               gender: Female
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/person'
 *       "400":
 *         $ref: '#/components/responses/DuplicatePerson'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all people
 *     description: Only admins can retrieve all people.
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: person name
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: person nationality
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: person gender
 *       - in: query
 *         name: dateOfBirth
 *         schema:
 *           type: string
 *         description: person date of birth
 *       - in: query
 *         name: alive
 *         schema:
 *           type: string
 *         description: person is alive or dead
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
 *         description: Maximum number of people
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
 *                     $ref: '#/components/schemas/person'
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
 * /people/{id}:
 *   get:
 *     summary: Get a person
 *     description: Only admins can get people.
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: person id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/person'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a person
 *     description: Only admins can update people.
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nationality:
 *                 type: string
 *               dateOfBirth:
 *                 type: date
 *               alive:
 *                 type: boolean
 *               gender:
 *                 type: string
 *             example:
 *               name: person name
 *               nationality: France
 *               dateOfBirth: 1945-09-30T00:00:00.002Z
 *               alive: true
 *               gender: Other
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/person'
 *       "400":
 *         $ref: '#/components/responses/DuplicatePerson'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a person
 *     description: Only admins can delete people.
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: person id
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
