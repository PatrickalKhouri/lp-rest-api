const faker = require('faker');
const { Record } = require('../../../src/models');


// AINDA FALTA A DURAÇÃO
describe('Record model', () => {
  describe('Record validation', () => {
    let newRecord;
    beforeEach(() => {
      newRecord = {
        artistId: faker.datatype.uuid(),
        name: faker.music.songName(),
        releaseYear: faker.finance.amount(1800, 2023, 0),
        country: faker.address.country() - ,
        duration:, 
        language: 'English',
        numberOfTracks: faker.finance.amount(1, 30, 0)
      };

    test('should correctly validate a valid Record', async () => {
      await expect(new Record(newRecord).validate()).resolves.toBeUndefined();
    });

    test("number of tracks can't be below zero", async () => {
      newRecord.numberOfTracks = -1;
      await expect(new Record(newRecord).validate()).rejects.toThrow();
    });

    test("release year cant be in the future", async () => {
      newRecord.releaseYear = new Date().getFullYear() + 1;
      await expect(new Record(newRecord).validate()).rejects.toThrow();
    });
    });
  });
});
