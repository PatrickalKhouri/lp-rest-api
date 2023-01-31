const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const shoppingSessionValidation = require('../../validations/shoppingSession.validation');
const shoppingSessionController = require('../../controllers/shoppingSession.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createShoppingSession'),
    validate(shoppingSessionValidation.createShoppingSession),
    shoppingSessionController.createShoppingSession
  )
  .get(
    auth('getShoppingSessions'),
    validate(shoppingSessionValidation.getShoppingSessions),
    shoppingSessionController.getShoppingSessions
  );

router
  .route('/:shoppingSessionId')
  .get(
    auth('getShoppingSessions'),
    validate(shoppingSessionValidation.getShoppingSession),
    shoppingSessionController.getShoppingSession
  )
  .patch(
    auth('manageShoppingSession'),
    validate(shoppingSessionValidation.updateShoppingSession),
    shoppingSessionController.updateShoppingSession
  )
  .delete(
    auth('manageShoppingSession'),
    validate(shoppingSessionValidation.deleteShoppingSession),
    shoppingSessionController.deleteShoppingSession
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ShoppingSessions
 *   description: Shopping Session management and retrieval
 */

/**
 * @swagger
 * /shoppingSessions:
 *   post:
 *     summary: Creates an shopping session
 *     description: Only admins can create for other users.
 *     tags: [ShoppingSessions]
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
 *               - total
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               total:
 *                 type: number
 *             example:
 *               userId: 63d83e72afb88a9cf62f8a97
 *               total: 320
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ShoppingSession'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Gets all Shopping Session
 *     description: Only admins can retrieve all Shopping Session.
 *     tags: [ShoppingSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of the shopping session
 *       - in: query
 *         name: total
 *         schema:
 *           type: string
 *         description: the total of the shopping session
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
 *         description: Maximum number of Shopping Session
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
 *                     $ref: '#/components/schemas/ShoppingSession'
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
 * /shoppingSessions/{id}:
 *   get:
 *     summary: Gets an Shopping Session
 *     description: Logged in users can fetch only their own shopping session. Only admins can fetch other Shopping Session.
 *     tags: [ShoppingSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: shopping session id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ShoppingSession'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an shopping session
 *     description: Logged in users can update only their own shopping session. Only admins can update other Shopping Session.
 *     tags: [ShoppingSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: shopping session id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - total
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               total:
 *                 type: number
 *             example:
 *               userId: 63d83e72afb88a9cf62f8a97
 *               userPaymentId: 63d83e6a6d2b5d025f9a31fe
 *               total: 12
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ShoppingSession'
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
 *     summary: Deletes a shopping session
 *     description: Logged in users can delete only their own shopping session. Only admins can delete other Shopping Session.
 *     tags: [ShoppingSessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: shopping session id
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
