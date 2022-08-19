const { Genre } = require('../../../src/models');

describe('Genre model', () => {
  describe('Genre validation', () => {
    let newGenre;
    beforeEach(() => {
      newGenre = {
        name: 'classical',
      };
    });

    test('should correctly validate a valid Genre', async () => {
      await expect(new Genre(newGenre).validate()).resolves.toBeUndefined();
    });
  });
});
