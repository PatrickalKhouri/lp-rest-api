const faker = require('faker');
const mongoose = require('mongoose');
const { CartItem } = require('../../../src/models');

describe('Cart Item model', () => {
  describe('Cart Item validation', () => {
    let newCartItem;
    beforeEach(() => {
      newCartItem = {
        shoppingSessionId: mongoose.Types.ObjectId(),
        albumId: mongoose.Types.ObjectId(),
        quantity: faker.finance.amount(0, 50, 2),
      };
    });

    test('should correctly validate a valid Cart Item', async () => {
      await expect(new CartItem(newCartItem).validate()).resolves.toBeUndefined();
    });

    test('Quantity cant be below 0', async () => {
      newCartItem.quantity = -1;
      await expect(new CartItem(newCartItem).validate()).rejects.toThrow();
    });
  });
});
