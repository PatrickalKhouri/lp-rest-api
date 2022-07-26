const faker = require('faker');
const { RecordGenre } = require('../../../src/models');

describe('Record Genre model', () => {
  describe('Record Genre validation', () => {
    let newrecordGenre;
    beforeEach(() => {
      newrecordGenre = {
        genreID: faker.datatype.uuid(),
        recordID: faker.datatype.uuid(),
      };
    });

    test('should correctly validate a valid Record Genre', async () => {
      await expect(new RecordGenre(newrecordGenre).validate()).resolves.toBeUndefined();
    });
  });
});
