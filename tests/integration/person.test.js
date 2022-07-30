const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Person } = require('../../src/models');
const { insertPeople, personOne, personTwo } = require('../fixtures/person.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Person routes', () => {
  describe('POST /v1/people', () => {
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

    test('should return 201 and successfully create new person if data is ok', async () => {
      await insertPeople([newPerson]);

      const res = await request(app)
        .post('/v1/person')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newPerson)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newPerson.name,
        dateOfBirth: newPerson.email,
        alive: newPerson.alive,
        nationality: newPerson.nationality,
        gender: newPerson.newPerson,
      });

      const dbPerson = await Person.findById(res.body.id);
      expect(dbPerson).toBeDefined();
      expect(dbPerson).toMatchObject({
        name: newPerson.name,
        dateOfBirth: newPerson.dateOfBirth,
        alive: newPerson.alive,
        nationality: newPerson.nationality,
        gender: newPerson.newPerson,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/person').send(newPerson).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertPeople([newPerson]);

      await request(app)
        .post('/v1/person')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newPerson)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if date of birth is on the future', async () => {
      newPerson.dateOfBirth = '3000-07-29T02:25:31.672Z';
      await insertPeople([newPerson]);

      await request(app)
        .post('/v1/person')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newPerson)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/people', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: personOne._id.toHexString(),
        name: personOne.name,
        dateOfBirth: personOne.dateOfBirth,
        alive: personOne.alive,
        nationality: personOne.nationality,
        gender: personOne.gender,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertPeople([personOne, personTwo]);

      await request(app).get('/v1/people').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all people', async () => {
      await insertPeople([personOne, personTwo]);

      await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: personOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(personOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'dateOfBirth:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(personOne._id.toHexString());
      expect(res.body.results[1].id).toBe(personTwo._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'dateOfBirth:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(personOne._id.toHexString());
      expect(res.body.results[1].id).toBe(personTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'dateOfBirth:desc,name:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);

      const expectedOrder = [personOne, personTwo].sort((a, b) => {
        if (a.dateOfBirth < b.dateOfBirth) {
          return 1;
        }
        if (a.dateOfBirth > b.dateOfBirth) {
          return -1;
        }
        return a.name < b.name ? -1 : 1;
      });

      expectedOrder.forEach((person, index) => {
        expect(res.body.results[index].id).toBe(person._id.toHexString());
      });
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertPeople([personOne, personTwo]);

      const res = await request(app)
        .get('/v1/people')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(personOne._id.toHexString());
    });
  });

  describe('GET /v1/people/:personId', () => {
    test('should return 200 and the person object if data is ok', async () => {
      await insertPeople([personOne]);

      const res = await request(app)
        .get(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: personOne._id.toHexString(),
        name: personOne.name,
        dateOfBirth: personOne.dateOfBirth,
        alive: personOne.alive,
        nationality: personOne.nationality,
        gender: personOne.gender,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertPeople([personOne]);

      await request(app).get(`/v1/people/${personOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertPeople([personOne]);

      await request(app)
        .get('/v1/people/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user is not found', async () => {
      await insertPeople([personOne]);

      await request(app)
        .get(`/v1/people/${personTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/people/:personId', () => {
    test('should return 204 if data is ok', async () => {
      await insertPeople([personOne]);

      await request(app)
        .delete(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbPerson = await Person.findById(personOne._id);
      expect(dbPerson).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertPeople([personOne]);

      await request(app).delete(`/v1/people/${personOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete without being Admin', async () => {
      await insertPeople([personOne]);

      await request(app)
        .delete(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if personId is not a valid mongo id', async () => {
      await insertPeople([personOne]);

      await request(app)
        .delete('/v1/people/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if person already is not found', async () => {
      await insertPeople([personOne]);

      await request(app)
        .delete(`/v1/people/${personTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/people/:personId', () => {
    test('should return 200 and successfully update user if data is ok', async () => {
      await insertPeople([personOne]);
      const updateBody = {
        name: faker.name.firstName(),
        alive: faker.datatype.boolean(),
        nationality: faker.address.country(),
        dateOfBirth: '1998-07-29T02:25:31.672Z',
      };

      const res = await request(app)
        .patch(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: personOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.alive,
        nationality: updateBody.nationality,
        dateOfBirth: updateBody.dateOfBirth,
      });

      const dbPerson = await Person.findById(personOne._id);
      expect(dbPerson).toBeDefined();
      expect(dbPerson).toMatchObject({
        id: personOne._id.toHexString(),
        name: updateBody.name,
        email: updateBody.alive,
        nationality: updateBody.nationality,
        dateOfBirth: updateBody.dateOfBirth,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertPeople([personOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app).patch(`/v1/people/${personOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if trying to update without being and admin', async () => {
      await insertPeople([personOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another person that is not found', async () => {
      await insertPeople([personOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/people/${personTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertPeople([personOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/people/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is invalid', async () => {
      await insertPeople([personOne]);
      const updateBody = { dateOfBirth: '3000-07-29T02:25:31.672Z' };

      await request(app)
        .patch(`/v1/people/${personOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
