const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Label } = require('../../src/models');
const { labelOne, labelTwo, insertLabels } = require('../fixtures/label.fixture');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Label routes', () => {
  describe('POST /v1/labels', () => {
    let newLabel;

    beforeEach(() => {
      newLabel = {
        name: faker.name.firstName(),
        country: faker.address.country(),
      };
    });

    test('should return 201 and successfully create new label if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newLabel)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newLabel.name,
        country: newLabel.country,
      });

      const dbLabel = await Label.findById(res.body.id);
      expect(dbLabel).toBeDefined();
      expect(dbLabel).toMatchObject({ name: newLabel.name, country: newLabel.country });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/labels').send(newLabel).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user creating isnt an admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/labels')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newLabel)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if country isnt valid', async () => {
      await insertUsers([admin]);
      newLabel.country = 'invalid country';

      await request(app)
        .post('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newLabel)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if label is already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      newLabel.country = labelOne.country;

      await request(app)
        .post('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newLabel)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/labels', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);

      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
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
      expect(res.body.results[0]).toEqual({
        id: labelOne._id.toHexString(),
        name: labelOne.name,
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertLabels([labelOne]);

      await request(app).get('/v1/labels').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all labels', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: labelOne.name })
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
      expect(res.body.results[0].id).toBe(labelOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);

      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:desc' })
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
      expect(res.body.results[0].id).toBe(labelOne._id.toHexString());
      expect(res.body.results[1].id).toBe(labelTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);

      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(labelOne._id.toHexString());
    });
  });

  describe('GET /v1/labels/:labelId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      const res = await request(app)
        .get(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: labelOne._id.toHexString(),
        name: labelOne.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([labelOne]);

      await request(app).get(`/v1/labels/${labelOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non admin is trying to get a label', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);

      await request(app)
        .get(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if labelId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      await request(app)
        .get('/v1/labels/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if label is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      await request(app)
        .get(`/v1/labels/${labelTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/labels/:labelId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      await request(app)
        .delete(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbLabel = await Label.findById(labelOne._id);
      expect(dbLabel).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertLabels([labelOne]);

      await request(app).delete(`/v1/labels/${labelOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user non admin is trying to delete genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);

      await request(app)
        .delete(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if labelId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      await request(app)
        .delete('/v1/labels/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if label is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelTwo]);

      await request(app)
        .delete(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/labels/:labelId', () => {
    test('should return 200 and successfully update label if data is ok', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);

      const updateBody = {
        name: faker.name.firstName(),
      };

      const res = await request(app)
        .patch(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: labelOne._id.toHexString(),
        name: updateBody.name,
      });

      const dbLabel = await Label.findById(labelOne._id);
      expect(dbLabel).toBeDefined();
      expect(dbLabel).toMatchObject({ name: updateBody.name });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertLabels([labelOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app).patch(`/v1/labels/${labelOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if non admin user is updating a genre', async () => {
      await insertUsers([userOne]);
      await insertLabels([labelOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating another label that is not found', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/labels/${labelTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if labelId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      const updateBody = { name: faker.name.firstName() };

      await request(app)
        .patch(`/v1/labels/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if country is invalid', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne]);
      const updateBody = { country: 'invalid country' };

      await request(app)
        .patch(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if label already exists', async () => {
      await insertUsers([admin]);
      await insertLabels([labelOne, labelTwo]);
      const updateBody = { name: labelTwo.name };

      await request(app)
        .patch(`/v1/labels/${labelOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
