const faker = require('faker');
const { Person } = require('../../../src/models');

describe('Person model', () => {
  describe('Person validation', () => {
    let newPerson;
    beforeEach(() => {
      newPerson = {
        name: faker.name.firstName(),
        dateOfBirth: '2000-07-29T02:25:31.672Z',
        alive: faker.datatype.boolean(),
        nationality: faker.address.country(),
        gender: faker.name.gender(true),
      };
    });

    test('should correctly validate a valid Person', async () => {
      await expect(new Person(newPerson).validate()).resolves.toBeUndefined();
    });

    test('date of birth cant be in the future', async () => {
      newPerson.dateOfBirth = '3000-07-29T02:25:31.672Z';
      await expect(new Person(newPerson).validate()).rejects.toThrow();
    });
  });
});
