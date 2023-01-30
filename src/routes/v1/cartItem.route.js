const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cartItemValidation = require('../../validations/cartItem.validation');
const cartItemController = require('../../controllers/cartItem.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createCartItem'), validate(cartItemValidation.createCartItems), cartItemController.createCartItem)
  .get(auth('getCartItems'), validate(cartItemValidation.getCartItems), cartItemController.getCartItems);

router
  .route('/:cartItemId')
  .get(auth('getCartItems'), validate(cartItemValidation.getCartItem), cartItemController.getCartItem)
  .patch(auth('manageCartItems'), validate(cartItemValidation.updateCartItem), cartItemController.updateCartItem)
  .delete(auth('manageCartItems'), validate(cartItemValidation.deleteCartItem), cartItemController.deleteCartItem);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: CartItems
 *   description: Cart Items management and retrieval
 */

/**
 * @swagger
 * /cartItems:
 *   post:
 *     summary: Creates a Cart Item
 *     description: Only admins can create for other users.
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shoppingSessionId
 *               - albumId
 *               - quantity
 *             properties:
 *               shoppingSessionId:
 *                 type: ObjectId,
 *               albumId:
 *                 type: ObjectId
 *               quantity:
 *                 type: number
 *               apartmentNumber:
 *                 type: string
 *             example:
 *               shoppingSessionId: 63d83e72afb88a9cf62f8a97
 *               albumId: 63d83e6a6d2b5d025f9a31fe
 *               quantity: 10
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CartItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Gets all Cart Items
 *     description: Only admins can retrieve all Cart Items.
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shoppingSessionId
 *         schema:
 *           type: string
 *         description: Shopping Session Id of the Cart Item
 *       - in: query
 *         name: albumId
 *         schema:
 *           type: string
 *         description: The Album Id of the Cart Item
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: string
 *         description: the quantity of the cart item
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
 *         description: Maximum number of cart items
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
 *                     $ref: '#/components/schemas/CartItem'
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
 * /cartItems/{id}:
 *   get:
 *     summary: Gets a Cart Items
 *     description: Logged in users can fetch only their own cart item. Only admins can fetch other cart items.
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CartItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Cart Item
 *     description: Logged in users can update only their own cart item. Only admins can update other cart items.
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shoppingSessionId
 *               - albumId
 *               - quantity
 *             properties:
 *               shoppingSessionId:
 *                 type: ObjectId,
 *               albumId:
 *                 type: ObjectId
 *               quantity:
 *                 type: number
 *               apartmentNumber:
 *                 type: string
 *             example:
 *               shoppingSessionId: 63d83e72afb88a9cf62f8a97
 *               albumId: 63d83e6a6d2b5d025f9a31fe
 *               quantity: 12
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CartItem'
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
 *     summary: Deletes a Cart Item
 *     description: Logged in users can delete only their own cart item. Only admins can delete other cart items.
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart Item id
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
