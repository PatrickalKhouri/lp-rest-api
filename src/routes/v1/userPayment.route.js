const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userPaymentValidation = require('../../validations/userPayment.validation');
const userPaymentController = require('../../controllers/userPayment.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createUserPayment'),
    validate(userPaymentValidation.createUserPayment),
    userPaymentController.createUserPayment
  )
  .get(auth('getUserPayments'), validate(userPaymentValidation.getUserPayments), userPaymentController.getUserPayments);

router
  .route('/:userPaymentId')
  .get(auth('getUserPayments'), validate(userPaymentValidation.getUserPayment), userPaymentController.getUserPayment)
  .patch(
    auth('manageUserPayments'),
    validate(userPaymentValidation.updateUserPayment),
    userPaymentController.updateUserPayment
  )
  .delete(
    auth('manageUserPayments'),
    validate(userPaymentValidation.deleteUserPayment),
    userPaymentController.deleteUserPayment
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UserPayments
 *   description: User Payment management and retrieval
 */

/**
 * @swagger
 * /usersPayments:
 *   post:
 *     summary: Create a user Payment
 *     description: Only admins can create for other users.
 *     tags: [UserPayments]
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
 *               - accountNumber
 *               - paymentType
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               accountNumber:
 *                 type: string
 *               paymentType:
 *                 type: string
 *               provider:
 *                 type: string
 *             example:
 *               userId: 507f191e810c19729de860ea
 *               accountNumber: '0000000-000'
 *               paymentType: 'Cartão de Crédito'
 *               provider: 'Visa'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPayment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Get all users Payments
 *     description: Only admins can retrieve all users Payments.
 *     tags: [UserPayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of that Payment
 *       - in: query
 *         name: accountNumber
 *         schema:
 *           type: string
 *         description: The account numbeer of the Payment
 *       - in: query
 *         name: paymentType
 *         schema:
 *           type: string
 *         description: The type of the Payment
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *         description: The provider of the Payment
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
 *         description: Maximum number of user addreses
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
 *                     $ref: '#/components/schemas/UserPayment'
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
 * /userPayments/{id}:
 *   get:
 *     summary: Get a user Payment
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [UserPayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Payment id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPayment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a user Payment
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [UserPayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Payment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - accountNumber
 *               - paymentType
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               accountNumber:
 *                 type: string
 *               paymentType:
 *                 type: string
 *               provider:
 *                 type: string
 *             example:
 *               userId: 507f191e810c19729de860ea
 *               accountNumber: '0000000-000'
 *               paymentType: 'Cartão de Crédito'
 *               provider: 'Master-card'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserPayment'
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
 *     summary: Delete a user Payment
 *     description: Logged in users can delete only their user Payments. Only admins can delete other user Payments.
 *     tags: [UserPayments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Payment id
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
