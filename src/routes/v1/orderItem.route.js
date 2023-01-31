const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderItemValidation = require('../../validations/orderItem.validation');
const orderItemController = require('../../controllers/orderItem.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createOrderItem'), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth('getOrderItems'), validate(orderItemValidation.getOrderItems), orderItemController.getOrderItems);

router
  .route('/:orderItemId')
  .get(auth('getOrderItems'), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .patch(auth('manageOrderItem'), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth('manageOrderItem'), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Order Items management and retrieval
 */

/**
 * @swagger
 * /orderItems:
 *   post:
 *     summary: Creates a Order Item
 *     description: Only admins can create for other users.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderDetailId
 *               - albumId
 *               - quantity
 *             properties:
 *               orderDetailId:
 *                 type: ObjectId,
 *               albumId:
 *                 type: ObjectId
 *               quantity:
 *                 type: number
 *               apartmentNumber:
 *                 type: string
 *             example:
 *               orderDetailId: 63d83e72afb88a9cf62f8a97
 *               albumId: 63d83e6a6d2b5d025f9a31fe
 *               quantity: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/OrderItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Gets all Order Items
 *     description: Only admins can retrieve all Order Items.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderDetailId
 *         schema:
 *           type: string
 *         description: Order Detail Id of the Order Item
 *       - in: query
 *         name: albumId
 *         schema:
 *           type: string
 *         description: The Album Id of the Order Item
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: string
 *         description: the quantity of the Order item
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
 *         description: Maximum number of Order items
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
 *                     $ref: '#/components/schemas/OrderItem'
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
 * /orderItems/{id}:
 *   get:
 *     summary: Gets a Order Items
 *     description: Logged in users can fetch only their own Order item. Only admins can fetch other Order items.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order Item id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/OrderItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Order Item
 *     description: Logged in users can update only their own Order item. Only admins can update other Order items.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order Item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderDetailId
 *               - albumId
 *               - quantity
 *             properties:
 *               orderDetailId:
 *                 type: ObjectId,
 *               albumId:
 *                 type: ObjectId
 *               quantity:
 *                 type: number
 *               apartmentNumber:
 *                 type: string
 *             example:
 *               orderDetailId: 63d83e72afb88a9cf62f8a97
 *               albumId: 63d83e6a6d2b5d025f9a31fe
 *               quantity: 12
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/OrderItem'
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
 *     summary: Deletes a Order Item
 *     description: Logged in users can delete only their own Order item. Only admins can delete other Order items.
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order Item id
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
