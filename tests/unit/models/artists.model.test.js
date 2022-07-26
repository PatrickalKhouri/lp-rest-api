const faker = require('faker');
const mongoose = require('mongoose');
const { Artist } = require('../../../src/models');

describe('Artist model', () => {
  describe('Artist validation', () => {
    let newArtist;
    beforeEach(() => {
      newArtist = {
        name: faker.name.findName(),
        country: faker.address.country(),
        labelId: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid Artist', async () => {
      await expect(new Artist(newArtist).validate()).resolves.toBeUndefined();
    });
  });
});
