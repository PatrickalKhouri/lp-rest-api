const faker = require('faker');
const { OrderItem } = require('../../../src/models');

describe('Order Item model', () => {
  describe('Order Item validation', () => {
    let newOrderItem;
    beforeEach(() => {
      newOrderItem = {
        orderId: faker.datatype.uuid(),
        albumId: faker.datatype.uuid(),
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