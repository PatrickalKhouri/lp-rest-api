const mongoose = require('mongoose');
const { RecordGenre } = require('../../../src/models');

describe('Record Genre model', () => {
  describe('Record Genre validation', () => {
    let newrecordGenre;
    beforeEach(() => {
      newrecordGenre = {
        genreId: mongoose.Types.ObjectId(),
        recordId: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid Record Genre', async () => {
      await expect(new RecordGenre(newrecordGenre).validate()).resolves.toBeUndefined();
    });
  });
});
