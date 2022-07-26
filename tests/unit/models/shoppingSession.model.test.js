const faker = require('faker');
const { ShoppingSession } = require('../../../src/models');

describe('Shopping Session model', () => {
  describe('Shopping Session validation', () => {
    let newShoppingSession;
    beforeEach(() => {
      newShoppingSession = {
        userId: faker.datatype.uuid(),
        total: faker.finance.amount(0, 1000, 2),
        createdAt: faker.datatype.datetime(),
        modifiedAt: faker.datatype.datetime(),
      };
    });

    test('should correctly validate a valid Shopping Session', async () => {
      await expect(new ShoppingSession(newShoppingSession).validate()).resolves.toBeUndefined();
    });

    test('total cant be below zero', async () => {
      newShoppingSession.total = -1;
      await expect(new ShoppingSession(newShoppingSession).validate()).rejects.toThrow();
    });
  });
});
