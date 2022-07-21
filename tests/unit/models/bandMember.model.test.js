const faker = require('faker');
const { BandMember } = require('../../../src/models');

describe('Band Member model', () => {
  describe('Band Member validation', () => {
    let newBandMember;
    beforeEach(() => {
      newBandMember = {
        artistId: faker.datatype.uuid(),
        personId: faker.datatype.uuid(),
        quantity: faker.finance.amount(0, 50, 2),
      };
    });

    test('should correctly validate a valid Band Member', async () => {
      await expect(new BandMember(newBandMember).validate()).resolves.toBeUndefined();
    });
  });
});
