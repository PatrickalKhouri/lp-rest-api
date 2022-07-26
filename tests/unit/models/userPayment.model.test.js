const faker = require('faker');
const { UserPayment } = require('../../../src/models');

describe('User Payment model', () => {
  describe('User Payment validation', () => {
    let newUserPayment;
    beforeEach(() => {
      newUserPayment = {
        userId: faker.datatype.uuid(),
        accountNumber: faker.finance.account(),
        paymentType: 'PIX',
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
