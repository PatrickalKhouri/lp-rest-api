const faker = require('faker');
const mongoose = require('mongoose');
const { UserAddress } = require('../../../src/models');

describe('User Address model', () => {
  describe('User Address validation', () => {
    let newUserAddress;
    beforeEach(() => {
      newUserAddress = {
        userId: mongoose.Types.ObjectId(),
        streetName: 'Rua Fonte da Saudade',
        buildingNumber: '114',
        postalCode: '22471-270',
        city: faker.address.city(),
        state: 'RJ',
        country: faker.address.country(),
        createdAt: faker.datatype.datetime(),
        modifiedAt: faker.datatype.datetime(),
      };
    });

    test('should correctly validate a valid user address', async () => {
      await expect(new UserAddress(newUserAddress).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if country is not on list', async () => {
      newUserAddress.country = 'non existing country';
      await expect(new UserAddress(newUserAddress).validate()).rejects.toThrow();
    });

    // test('should throw a validation error if the address number is an integer', async () => {
    //   newUserAddress.streetNumber = 40;
    //   await expect(new UserAddress(newUserAddress).validate()).rejects.toThrow();
    // });

    test('should throw a validation error the state is not on the lsit', async () => {
      newUserAddress.state = 'non existing state';
      await expect(new UserAddress(newUserAddress).validate()).rejects.toThrow();
    });

    test('should throw a validation error if the zip code number is invalid in Brazil', async () => {
      newUserAddress.postalCode = 'not a valid zipCopde';
      await expect(new UserAddress(newUserAddress).validate()).rejects.toThrow();
    });
  });
});
