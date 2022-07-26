const faker = require('faker');
const mongoose = require('mongoose');
const { Record } = require('../../../src/models');

describe('Record model', () => {
  describe('Record validation', () => {
    let newRecord;
    beforeEach(() => {
      newRecord = {
        artistId: mongoose.Types.ObjectId(),
        name: faker.music.songName(),
        releaseYear: faker.finance.amount(1800, 2023, 0),
        country: faker.address.country(),
        duration: '20:10',
        language: 'English',
        numberOfTracks: faker.finance.amount(1, 30, 0),
      };

      test('should correctly validate a valid Record', async () => {
        await expect(new Record(newRecord).validate()).resolves.toBeUndefined();
      });

      test("number of tracks can't be below zero", async () => {
        newRecord.numberOfTracks = -1;
        await expect(new Record(newRecord).validate()).rejects.toThrow();
      });

      test('should throw a validation error if the duration is in the wrong format', async () => {
        newRecord.duration = 'not a valid duratiob';
        await expect(new Record(newRecord).validate()).rejects.toThrow();
      });

      test('release year cant be in the future', async () => {
        newRecord.releaseYear = new Date().getFullYear() + 1;
        await expect(new Record(newRecord).validate()).rejects.toThrow();
      });
    });
  });
});
