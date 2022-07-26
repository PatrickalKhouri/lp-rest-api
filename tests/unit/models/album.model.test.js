const faker = require('faker');
const { Album } = require('../../../src/models');

describe('Album model', () => {
  describe('Album validation', () => {
    let newAlbum;
    beforeEach(() => {
      newAlbum = {
        userId: faker.datatype.uuid(),
        recordId: faker.datatype.uuid(),
        description: faker.lorem.lines(),
        stock: faker.finance.amount(0, 50, 2),
        year: faker.finance.amount(1800, 2022, 0),
        new: faker.datatype.boolean(),
        price: faker.finance.amount(1, 1000, 2),
        type: 'LP',
      };
    });

    test('should correctly validate a valid Album', async () => {
      await expect(new Album(newAlbum).validate()).resolves.toBeUndefined();
    });

    test('Year cant be in the future', async () => {
      newAlbum.year = 3000;
      await expect(new Album(newAlbum).validate()).rejects.toThrow();
    });

    test('Price cant be below zero', async () => {
      newAlbum.price = -1;
      await expect(new Album(newAlbum).validate()).rejects.toThrow();
    });

    test('Stock cant be below zero', async () => {
      newAlbum.stock = -1;
      await expect(new Album(newAlbum).validate()).rejects.toThrow();
    });
  });
});
