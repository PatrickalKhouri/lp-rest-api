const faker = require('faker');
const mongoose = require('mongoose');
const { UserPayment } = require('../../../src/models');

describe('User Payment model', () => {
  describe('User Payment validation', () => {
    let newUserPayment;
    beforeEach(() => {
      newUserPayment = {
        userId: mongoose.Types.ObjectId(),
        accountNumber: faker.finance.account(),
        paymentType: 'Pix',
        provider: 'Visa',
        createdAt: faker.datatype.datetime(),
        modifiedAt: faker.datatype.datetime(),
      };
    });

    test('should correctly validate a valid User Payment', async () => {
      await expect(new UserPayment(newUserPayment).validate()).resolves.toBeUndefined();
    });
  });
});
