const faker = require('faker');
const mongoose = require('mongoose');
const { OrderDetail } = require('../../../src/models');

describe('Order Detail model', () => {
  describe('Order Detail validation', () => {
    let newOrderDetail;
    beforeEach(() => {
      newOrderDetail = {
        userId: mongoose.Types.ObjectId(),
        userPaymentId: mongoose.Types.ObjectId(),
        total: faker.finance.amount(0, 50, 2),
      };
    });

    test('should correctly validate a valid Order Detail', async () => {
      await expect(new OrderDetail(newOrderDetail).validate()).resolves.toBeUndefined();
    });

    test('Total cant be below 0', async () => {
      newOrderDetail.total = -1;
      await expect(new OrderDetail(newOrderDetail).validate()).rejects.toThrow();
    });
  });
});