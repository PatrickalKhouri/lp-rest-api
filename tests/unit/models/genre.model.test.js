const faker = require('faker');
const { Genre } = require('../../../src/models');

describe('Genre model', () => {
  describe('Genre validation', () => {
    let newGenre;
    beforeEach(() => {
      newGenre = {
        name: faker.music.genre(),
      };
    });

    test('should correctly validate a valid Genre', async () => {
      await expect(new Genre(newGenre).validate()).resolves.toBeUndefined();
    });
  });
});
