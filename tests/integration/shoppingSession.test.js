const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { ShoppingSession } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { shoppingSessionOne, shoppingSessionTwo, insertShoppingSessions } = require('../fixtures/shoppingSession.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { describe } = require('pm2');

setupTestDB();

describe('Shopping Session routes', () => {
  describe('POST /v1/shoppingSessions', () => {
    let newShoppingSession;

    beforeEach(() => {
      newShoppingSession = {
        userId: userOne._id,
        total: faker.finance.amount(0, 1000, 2),
      };
    });

    test('should return 201 and successfully create new user if data is ok', async () => {
      await insertUsers([admin, userOne]);

      const res = await request(app)
        .post('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newShoppingSession)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        userId: String(newShoppingSession.userId),
        total: Number(newShoppingSession.total),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/shoppingSessions').send(newShoppingSession).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user creating new shopping session for another user', async () => {
      await insertUsers([userOne, userTwo]);

      await request(app)
        .post('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(newShoppingSession)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if total is smaller than zero', async () => {
      await insertUsers([admin]);
      newShoppingSession.total = -10;

      await request(app)
        .post('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newShoppingSession)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/shoppingSessions', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      const res = await request(app)
        .get('/v1/shoppingSessions')
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
      // expect(res.body.results[0]).toEqual({
      //   id: shoppingSessionOne._id.toHexString(),
      //   userId: String(shoppingSessionOne.userId),
      //   total: Number(shoppingSessionOne.total),
      // });
    });

    test('should return 401 if access token is missing', async () => {
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app).get('/v1/shoppingSessions').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all shopping sessions', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      await request(app)
        .get('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should correctly apply filter on provider field', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);

      const res = await request(app)
        .get('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ total: shoppingSessionOne.total })
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
      expect(res.body.results[0].id).toBe(shoppingSessionOne._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      shoppingSessionOne.total = 1;
      shoppingSessionTwo.total = 2;
      await insertUsers([userOne, userTwo, admin]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      const res = await request(app)
        .get('/v1/shoppingSessions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'total:desc' })
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
      expect(res.body.results[1].id).toBe(shoppingSessionOne._id.toHexString());
      expect(res.body.results[0].id).toBe(shoppingSessionTwo._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      const res = await request(app)
        .get('/v1/shoppingSessions')
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
      // expect(res.body.results).toHaveLength(1);
      // expect(res.body.results[0].id).toBe(shoppingSessionOne._id.toHexString());
    });
  });

  describe('GET /v1/shoppingSessions/user/:userId', () => {
    test('should return 200 if user is trying to acess all of his shpping sessions', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      const res = await request(app)
        .get(`/v1/shoppingSessions/user/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
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
      expect(res.body.results[0].id).toBe(shoppingSessionOne._id.toHexString());
    });

    test('should return 401 if non admin user is trying to acess all of another users shopping session', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionOne, shoppingSessionTwo]);

      await request(app)
        .get(`/v1/shoppingSessions/user/${userOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/shoppingSessions/:shoppingSessionId', () => {
    test('should return 200 and the shopping session object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);

      const res = await request(app)
        .get(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: shoppingSessionOne._id.toHexString(),
        userId: String(shoppingSessionOne.userId),
        total: shoppingSessionOne.total,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app).get(`/v1/shoppingSessions/${shoppingSessionOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get another users Shopping Session', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);

      await request(app)
        .get(`/v1/shoppingSessions/${shoppingSessionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and the user object if admin is trying to get another users Shopping Session', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .get(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('should return 400 error if shoppingSessionId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .get('/v1/shoppingSessions/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if shopping session is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .get(`/v1/shoppingSessions/${shoppingSessionTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/shoppingSessions/:shoppingSessionId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .delete(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbShoppingSession = await ShoppingSession.findById(shoppingSessionOne._id);
      expect(dbShoppingSession).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app).delete(`/v1/shoppingSessions/${shoppingSessionOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete another user shopping session', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);

      await request(app)
        .delete(`/v1/shoppingSessions/${shoppingSessionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 204 if admin is trying to delete another user shopping session', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .delete(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if shoppingSessionId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);

      await request(app)
        .delete('/v1/shoppingSessions/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/shoppingSessions/:userId', () => {
    test('should return 200 and successfully update shopping session if data is ok', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);

      const updateBody = {
        total: faker.finance.amount(0, 1000, 2),
      };

      const res = await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: shoppingSessionOne._id.toHexString(),
        userId: String(shoppingSessionOne.userId),
        total: Number(updateBody.total),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertShoppingSessions([shoppingSessionOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating another shopping session', async () => {
      await insertUsers([userOne, userTwo]);
      await insertShoppingSessions([shoppingSessionTwo]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 and successfully update shopping session if admin is updating another user shopping session', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating another shopping session that is not found', async () => {
      await insertUsers([userOne, admin]);
      await insertShoppingSessions([shoppingSessionOne]);
      const updateBody = { total: faker.finance.amount(0, 1000, 2) };

      await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if total is below 0', async () => {
      await insertUsers([userOne]);
      await insertShoppingSessions([shoppingSessionOne]);
      const updateBody = { total: -10 };

      await request(app)
        .patch(`/v1/shoppingSessions/${shoppingSessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
