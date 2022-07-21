const faker = require('faker');
const { Label } = require('../../../src/models');

describe('Label model', () => {
  describe('Label validation', () => {
    let newLabel;
    beforeEach(() => {
      newLabel = {
        name: faker.random.word(),
        country: faker.address.country(),
      };
    });

    test('should correctly validate a valid Label', async () => {
      await expect(new Label(newLabel).validate()).resolves.toBeUndefined();
    });
  });
});
