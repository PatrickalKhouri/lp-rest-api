const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bandMemberValidation = require('../../validations/bandMember.validation');
const bandMemberController = require('../../controllers/bandMember.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createBandMember'), validate(bandMemberValidation.createBandMember), bandMemberController.createBandMember)
  .get(auth('manageBandMembers'), validate(bandMemberValidation.getBandMember), bandMemberController.getBandMembers);

router
  .route('/:bandMemberId')
  .get(auth('manageBandMembers'), validate(bandMemberValidation.getBandMember), bandMemberController.getBandMember)
  .patch(auth('manageBandMembers'), validate(bandMemberValidation.updateBandMember), bandMemberController.updateBandMember)
  .delete(auth('manageBandMembers'), validate(bandMemberValidation.deleteBandMember), bandMemberController.deleteBandMember);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: BandMembers
 *   description: band member management and retrieval
 */

/**
 * @swagger
 * /bandMembers:
 *   post:
 *     summary: Creates a Band Member
 *     description: Only admins can create Band Members.
 *     tags: [BandMembers]
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
 *                $ref: '#/components/schemas/BandMember'
 *       "400":
 *         $ref: '#/components/responses/DuplicatebandMember'
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
 *     tags: [BandMembers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: string
 *         description: bandMember artist
 *       - in: query
 *         name: personId
 *         schema:
 *           type: string
 *         description: bandMember person
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
 *                     $ref: '#/components/schemas/BandMember'
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
 * /bandMembers/{id}:
 *   get:
 *     summary: Get an Band Member
 *     description: Only admins can get Band Members.
 *     tags: [BandMembers]
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
 *                $ref: '#/components/schemas/BandMember'
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
 *     tags: [BandMembers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: bandMember id
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
 *                $ref: '#/components/schemas/BandMember'
 *       "400":
 *         $ref: '#/components/responses/DuplicateBandMember'
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
 *     tags: [BandMembers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: bandMember id
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
