const faker = require('faker');
const mongoose = require('mongoose');
const { OrderItem } = require('../../../src/models');

describe('Order Item model', () => {
  describe('Order Item validation', () => {
    let newOrderItem;
    beforeEach(() => {
      newOrderItem = {
        orderDetailId: mongoose.Types.ObjectId(),
        albumId: mongoose.Types.ObjectId(),
        quantity: faker.finance.amount(0, 50, 2),
      };
    });

    test('should correctly validate a valid Order Item', async () => {
      await expect(new OrderItem(newOrderItem).validate()).resolves.toBeUndefined();
    });

    test('Quantity cant be below 0', async () => {
      newOrderItem.quantity = -1;
      await expect(new OrderItem(newOrderItem).validate()).rejects.toThrow();
    });
  });
});