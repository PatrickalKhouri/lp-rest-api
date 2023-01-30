const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderDetailValidation = require('../../validations/orderDetail.validation');
const orderDetailController = require('../../controllers/orderDetail.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createOrderDetail'),
    validate(orderDetailValidation.createOrderDetail),
    orderDetailController.createOrderDetail
  )
  .get(auth('getOrderDetails'), validate(orderDetailValidation.getOrderDetails), orderDetailController.getOrderDetails);

router
  .route('/:orderDetailId')
  .get(auth('getOrderDetails'), validate(orderDetailValidation.getOrderDetail), orderDetailController.getOrderDetail)
  .patch(
    auth('manageOrderDetail'),
    validate(orderDetailValidation.updateOrderDetail),
    orderDetailController.updateOrderDetail
  )
  .delete(
    auth('manageOrderDetail'),
    validate(orderDetailValidation.deleteOrderDetail),
    orderDetailController.deleteOrderDetail
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description: Order Details management and retrieval
 */

/**
 * @swagger
 * /orderDetails:
 *   post:
 *     summary: Creates an Order Detail
 *     description: Only admins can create for other users.
 *     tags: [OrderDetails]
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
 *               - userPaymentId
 *               - total
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               userPaymentId:
 *                 type: ObjectId
 *               total:
 *                 type: number
 *             example:
 *               userId: 63d83e72afb88a9cf62f8a97
 *               userPaymentId: 63d83e6a6d2b5d025f9a31fe
 *               total: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/OrderDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Gets all Order Details
 *     description: Only admins can retrieve all Order Details.
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User Id of the order detail
 *       - in: query
 *         name: userPaymentId
 *         schema:
 *           type: string
 *         description: The User Payment Id of the order detail
 *       - in: query
 *         name: total
 *         schema:
 *           type: string
 *         description: the total of the order detail
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
 *         description: Maximum number of Order Details
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
 *                     $ref: '#/components/schemas/OrderDetail'
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
 * /orderDetails/{id}:
 *   get:
 *     summary: Gets an Order Details
 *     description: Logged in users can fetch only their own order detail. Only admins can fetch other Order Details.
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: order detail id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/OrderDetail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an order detail
 *     description: Logged in users can update only their own order detail. Only admins can update other Order Details.
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: order detail id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userPaymentId
 *               - total
 *             properties:
 *               userId:
 *                 type: ObjectId,
 *               userPaymentId:
 *                 type: ObjectId
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
 *                $ref: '#/components/schemas/OrderDetail'
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
 *     summary: Deletes a order detail
 *     description: Logged in users can delete only their own order detail. Only admins can delete other Order Details.
 *     tags: [OrderDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: order detail id
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
